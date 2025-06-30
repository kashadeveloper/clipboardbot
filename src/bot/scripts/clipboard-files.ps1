[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Add-Type -AssemblyName System.Windows.Forms

if ([Windows.Forms.Clipboard]::ContainsFileDropList()) {
    $files = [Windows.Forms.Clipboard]::GetFileDropList()
    foreach ($file in $files) {
        Write-Output $file
    }
} else {
    Write-Output ""
}
