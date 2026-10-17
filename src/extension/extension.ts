import * as path from 'path';
import * as vscode from 'vscode';

// Must match the view id contributed under "views.explorer" in package.json.
const VIEW_ID = 'vscodeMario.explorerView';

// Entry point VS Code calls when the extension activates.
export function activate(context: vscode.ExtensionContext): void
{
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(VIEW_ID, new MarioViewProvider(context.extensionPath),
    {
      // Keeps the character's state alive while the Explorer section is collapsed or hidden.
      webviewOptions: { retainContextWhenHidden: true },
    }),
    // VS Code generates a "<view id>.focus" command for every contributed view, which
    // expands and reveals it, so the command palette entry just reuses that.
    vscode.commands.registerCommand('vscode-mario.start', () =>
      vscode.commands.executeCommand(`${VIEW_ID}.focus`),
    ),
  );
}

// Fills the Explorer section with the webview that hosts the character.
class MarioViewProvider implements vscode.WebviewViewProvider
{
  constructor(private readonly extensionPath: string)
  {
  }

  // Called by VS Code the first time the section becomes visible.
  resolveWebviewView(view: vscode.WebviewView): void
  {
    // Restrict the webview to only load files from these folders, for security.
    view.webview.options =
    {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(path.join(this.extensionPath, 'media')),
        vscode.Uri.file(path.join(this.extensionPath, 'dist')),
      ],
    };

    // Convert filesystem paths into URIs the webview's sandboxed context is allowed to load.
    const mediaUri = view.webview.asWebviewUri(vscode.Uri.file(path.join(this.extensionPath, 'media')));
    const scriptUri = view.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.extensionPath, 'dist', 'panel.js')),
    );

    const characterTypes = vscode.workspace.getConfiguration('vscode-mario').get<string[]>('characters', ['mario', 'luigi']);

    view.webview.html = getWebviewContent(mediaUri.toString(), scriptUri.toString(), characterTypes);
  }
}

// Builds the HTML shell for the webview. The media URI and character type are passed in as
// globals so panel.js can read them without needing a message round trip on startup.
function getWebviewContent(mediaUri: string, scriptUri: string, characterTypes: string[]): string
{
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: transparent; }
  #stage { position: relative; width: 100%; height: 100%; }
  .character { position: absolute; image-rendering: pixelated; }
</style>
</head>
<body>
<div id="stage"></div>
<script>
  window.__marioMediaUri = ${JSON.stringify(mediaUri)};
  window.__marioCharacterTypes = ${JSON.stringify(characterTypes)};
</script>
<script src="${scriptUri}"></script>
</body>
</html>`;
}

export function deactivate(): void {}
