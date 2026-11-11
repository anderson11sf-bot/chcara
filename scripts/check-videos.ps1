$videos = @(
  'C:\Users\ander\OneDrive\Desktop\lago drone\VIDEOS\usar\anim sesao 2\lv_0_20261110213930.mp4',
  'C:\Users\ander\OneDrive\Desktop\lago drone\VIDEOS\usar\videos sao jose\lv_0_20261111003823.mp4',
  'C:\Users\ander\OneDrive\Desktop\lago drone\VIDEOS\usar\mostrando o terreno de cima\lv_0_20261111001516.mp4',
  'C:\Users\ander\OneDrive\Desktop\lago drone\IMAGENS\Aerial_drone_video_of_property_6494da8b_1080p.mp4'
)
foreach ($vid in $videos) {
  Write-Host "--- $vid ---"
  ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of default=noprint_wrappers=1 "$vid"
}
