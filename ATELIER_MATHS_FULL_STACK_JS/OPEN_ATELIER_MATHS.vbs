' One-click quiet launcher for Windows (requires Node.js installed).
Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
shell.CurrentDirectory = fso.GetParentFolderName(WScript.ScriptFullName)
program = Chr(34) & shell.CurrentDirectory & "\START_ATELIER_MATHS.bat" & Chr(34)
shell.Run program, 0, False
