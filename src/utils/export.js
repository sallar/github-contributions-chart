import axios from "axios";

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

export async function onShareTwitter(canvas) {
  try {
    const dataUrl = canvas.toDataURL();
    const res = await axios.post("/twitter", {
      image: dataUrl
    });
    const url = window.encodeURIComponent(res.data.image_url);
    const text = "Happy Coding! https://github-contributions.now.sh";
    window.open(`https://twitter.com/share?text=${text}&url=${url}`);
  } catch (err) {
    console.error(err);
  }
}
