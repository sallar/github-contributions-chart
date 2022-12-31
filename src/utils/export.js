const API_URL = "/api/v1/";

export function fetchData(username) {
  return fetch(API_URL + username).then(res => res.json());
}

export function download(canvas) {
  try {
    const dataUrl = canvas.toDataURL();
    const a = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.png";
    a.href = dataUrl;
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
  }
}

export function downloadJSON(data) {
  try {
    const dataString = JSON.stringify(data);
    const dataUrl = "data:text/json;charset=utf-8," + encodeURIComponent(dataString);
    const a = document.createElement("a");
    document.body.insertAdjacentElement("beforeend", a);
    a.download = "contributions.json";
    a.href = dataUrl;
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
  }
}

export async function uploadToTwitter(canvas) {
  try {
    const data = await fetch(API_URL + "tweetMedia", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: canvas.toDataURL()
      })
    }).then(res => res.json());
    const url = window.encodeURIComponent(data.mediaUrl);
    const text = window.encodeURIComponent(
      "Check out my #GitHubContributions history over time. A free tool by @sallar and friends. https://github-contributions.vercel.app"
    );
    window.open(`https://twitter.com/share?text=${text}&url=${url}`);
  } catch (err) {
    console.error(err);
  }
}

export function cleanUsername(username){
  return username.replace(/^(http|https):\/\/(?!www\.)github\.com\//, '');
}
