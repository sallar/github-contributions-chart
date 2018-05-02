export function download(canvas) {
  try {
    const dataUrl = canvas.toDataURL();
    const a = document.createElement("a");
    a.download = "contributions.png";
    a.href = dataUrl;
    a.click();
  } catch (err) {
    console.error(err);
  }
}
