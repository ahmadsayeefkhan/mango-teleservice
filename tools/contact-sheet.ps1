param([string]$Pattern = "*-1440.png", [string]$Out = "sheet.png", [int]$ThumbW = 300, [int]$MaxH = 2600, [int]$PerSheet = 10)
Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\asufi\Desktop\Mango Teleservice\website\shots\final"
$files = Get-ChildItem $dir -Filter $Pattern | Sort-Object Name
$sheets = [Math]::Ceiling($files.Count / $PerSheet)
for ($s = 0; $s -lt $sheets; $s++) {
  $batch = $files | Select-Object -Skip ($s * $PerSheet) -First $PerSheet
  $thumbs = foreach ($f in $batch) {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $h = [int]($img.Height * $ThumbW / $img.Width); $hh = [Math]::Min($h, $MaxH)
    $bmp = New-Object System.Drawing.Bitmap $ThumbW, ($hh + 22)
    $g = [System.Drawing.Graphics]::FromImage($bmp); $g.Clear([System.Drawing.Color]::White)
    $g.InterpolationMode = "HighQualityBicubic"
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 22, $ThumbW, $h))
    $g.DrawString($f.BaseName, (New-Object System.Drawing.Font "Consolas", 9), [System.Drawing.Brushes]::Black, 2, 3)
    $g.Dispose(); $img.Dispose(); $bmp
  }
  $W = ($ThumbW + 10) * $thumbs.Count; $H = ($thumbs | Measure-Object -Property Height -Maximum).Maximum
  $sheet = New-Object System.Drawing.Bitmap ([int]$W), ([int]$H)
  $g = [System.Drawing.Graphics]::FromImage($sheet); $g.Clear([System.Drawing.Color]::FromArgb(160,160,160))
  $x = 0; foreach ($t in $thumbs) { $g.DrawImage($t, $x, 0); $x += $ThumbW + 10; $t.Dispose() }
  $name = "$dir\$($Out.Replace('.png',''))-$($s+1).png"; $sheet.Save($name); $g.Dispose(); $sheet.Dispose()
  "$name ${W}x${H}"
}
