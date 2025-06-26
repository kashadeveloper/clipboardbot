Add-Type -AssemblyName System.Windows.Forms

if ([Windows.Forms.Clipboard]::ContainsFileDropList()) {
    $files = [Windows.Forms.Clipboard]::GetFileDropList()
    foreach ($file in $files) {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($file)
        $utf8String = [System.Text.Encoding]::UTF8.GetString($bytes)
        Write-Output $utf8String
    }
} else {
    Write-Output ""
}
