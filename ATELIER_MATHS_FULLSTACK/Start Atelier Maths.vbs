' Start Atelier Maths invisibly and open it in the default browser.
' This file launches Node.js, not Python. No command window is required.
Option Explicit
Dim shell, fso, base, nodeExe, localNode, systemNode, userNode, status, quoted, cmd
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
base = fso.GetParentFolderName(WScript.ScriptFullName)
localNode = base & "\runtime\node.exe"
systemNode = shell.ExpandEnvironmentStrings("%ProgramFiles%") & "\nodejs\node.exe"
userNode = shell.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Programs\nodejs\node.exe"
nodeExe = ""
If fso.FileExists(localNode) Then
  nodeExe = localNode
ElseIf fso.FileExists(systemNode) Then
  nodeExe = systemNode
ElseIf fso.FileExists(userNode) Then
  nodeExe = userNode
Else
  status = shell.Run("cmd /c node --version >nul 2>&1", 0, True)
  If status = 0 Then nodeExe = "node"
End If
If nodeExe = "" Then
  MsgBox "Node.js is needed for the local backend. Install Node.js LTS once, then double-click Start Atelier Maths again." & vbCrLf & vbCrLf & "No Python, .venv, deployment or terminal commands are required.", vbExclamation, "Atelier Maths - Setup"
  WScript.Quit 1
End If
shell.CurrentDirectory = base
' If an Atelier server is already running, reopening the browser is sufficient.
status = shell.Run("cmd /c curl --connect-timeout 1 --max-time 3 -fsS http://127.0.0.1:4173/api/health >nul 2>&1", 0, True)
If status <> 0 Then
  quoted = Chr(34)
  cmd = quoted & nodeExe & quoted & " " & quoted & base & "\server\index.js" & quoted
  shell.Run cmd, 0, False
  WScript.Sleep 1400
End If
shell.Run "http://127.0.0.1:4173", 1, False
