
async function loadPosts() {
  const container = document.getElementById('content');
  const indexRes = await fetch('posts/index.json');
  const files = await indexRes.json();
  container.innerHTML = '';

  for (const file of files) {
    const res = await fetch('posts/' + file);
    const text = await res.text();
    const html = marked.parse(text.split('---')[2] || '');
    const meta = text.match(/---([\s\S]*?)---/)[1];
    const image = meta.match(/image: (.*)/)?.[1]?.trim();
    const title = meta.match(/title: (.*)/)?.[1]?.trim();

    const section = document.createElement('section');
    section.className = 'post';
    section.innerHTML = `
      <h2>${title}</h2>
      ${image ? `<img src="${image}" alt="${title}" />` : ''}
      ${html}
    `;
    container.appendChild(section);
  }
}
loadPosts();
