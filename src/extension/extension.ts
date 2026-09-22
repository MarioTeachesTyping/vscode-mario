import * as path from 'path';
import * as vscode from 'vscode';

let panel: vscode.WebviewPanel | undefined;

// Entry point VS Code calls when the extension activates.
export function activate(context: vscode.ExtensionContext): void
{
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-mario.start', () => showPanel(context)),
  );
}

// Opens the webview panel that hosts the character, or focuses it if one is already open.
function showPanel(context: vscode.ExtensionContext): void
{
  if (panel)
  {
    panel.reveal();
    return;
  }

  panel = vscode.window.createWebviewPanel('vscodeMario', 'Mario', vscode.ViewColumn.Beside,
  {
    enableScripts: true,
    retainContextWhenHidden: true,
    // Restrict the webview to only load files from these folders, for security.
    localResourceRoots: [
      vscode.Uri.file(path.join(context.extensionPath, 'media')),
      vscode.Uri.file(path.join(context.extensionPath, 'dist')),
    ],
  });

  // Convert filesystem paths into URIs the webview's sandboxed context is allowed to load.
  const mediaUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media')));
  const scriptUri = panel.webview.asWebviewUri(
    vscode.Uri.file(path.join(context.extensionPath, 'dist', 'panel.js')),
  );

  const characterType = vscode.workspace.getConfiguration('vscode-mario').get<string>('characterType', 'mario');

  panel.webview.html = getWebviewContent(mediaUri.toString(), scriptUri.toString(), characterType);

  panel.onDidDispose(
    () =>
    {
      panel = undefined;
    },
    null,
    context.subscriptions,
  );
}

// Builds the HTML shell for the webview. The media URI and character type are passed in as
// globals so panel.js can read them without needing a message round trip on startup.
function getWebviewContent(mediaUri: string, scriptUri: string, characterType: string): string
{
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: transparent; }
  #stage { position: relative; width: 100%; height: 100%; }
  .character { position: absolute; width: 64px; height: 64px; image-rendering: pixelated; }
</style>
</head>
<body>
<div id="stage"></div>
<script>
  window.__marioMediaUri = ${JSON.stringify(mediaUri)};
  window.__marioCharacterType = ${JSON.stringify(characterType)};
</script>
<script src="${scriptUri}"></script>
</body>
</html>`;
}

export function deactivate(): void {}
