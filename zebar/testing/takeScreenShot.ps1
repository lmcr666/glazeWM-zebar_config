param (
  [string]$filePath = "./screenshots/"
)

# Import required functions from user32.dll
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WindowHelper {
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
}
"@

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Ensure the directory exists; if it doesn't, create it
if (-not (Test-Path -Path $filePath)) {
  New-Item -ItemType Directory -Path $filePath
}

# Function to minimize all windows
function Out-MinimizeAllWindows {
  $shell = New-Object -ComObject Shell.Application
  $shell.MinimizeAll()
}

# Function to restore all windows
function Out-RestoreAllWindows {
  $shell = New-Object -ComObject Shell.Application
  $shell.UndoMinimizeAll()
}

# Function to take a screenshot
function Take-Screenshot {
  $screenshot = [System.Windows.Forms.SystemInformation]::VirtualScreen
  $bitmap = New-Object System.Drawing.Bitmap $screenshot.Width, $screenshot.Height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.CopyFromScreen($screenshot.Location, [System.Drawing.Point]::Empty, $screenshot.Size)
  return $bitmap
}

# Function to extract colors from screenshot
function Get-TopColors {
  param (
    [System.Drawing.Bitmap]$image,
    [int]$numColors = 3
  )

  $colorCount = @{}
  
  for ($x = 0; $x -lt $image.Width; $x++) {
    for ($y = 0; $y -lt $image.Height; $y++) {
      $color = $image.GetPixel($x, $y)
      $colorKey = "$($color.R),$($color.G),$($color.B)"
      
      if ($colorCount.ContainsKey($colorKey)) {
        $colorCount[$colorKey] += 1
      } else {
        $colorCount[$colorKey] = 1
      }
    }
  }
  
  # Sort colors by frequency and get the top N
  $topColors = $colorCount.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First $numColors
  return $topColors | ForEach-Object { $_.Key }
}

# Function to update the css file


# Main script
Out-MinimizeAllWindows

# Wait for a moment to ensure all windows are minimized
Start-Sleep -Seconds 0.5

# Take a screenshot

# Save the screenshot
$bitmap.Save($filePath + "screenshot.png", [System.Drawing.Imaging.ImageFormat]::Png)

# Dispose of graphics and bitmap objects
$graphics.Dispose()
$bitmap.Dispose()

# Wait for a moment to ensure the screenshot is taken
Start-Sleep -Seconds 0.5

# Restore all windows after taking the screenshot
Out-RestoreAllWindows

Read-Host -Prompt "Press Enter to close the window"