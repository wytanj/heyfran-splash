/** Small DOM helpers shared by every rendition. */
import { pickFortune } from "./fortunes.js";

export function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function wordmark(tone = "yellow") {
  const img = el("img", "wordmark");
  img.src = `/wordmark-${tone}.png`;
  img.alt = "fran";
  img.decoding = "async";
  img.width = 2245;
  img.height = 1182;
  return img;
}

export function footer() {
  const p = el("p", "footer");
  const a = el("a", null, "heyfran.com");
  a.href = "https://heyfran.com";
  p.append(a);
  return p;
}

function crackShell() {
  const wrap = el("button", "cookie");
  wrap.type = "button";
  wrap.setAttribute("aria-label", "Crack for a new fortune");
  wrap.innerHTML = `
    <svg class="cookie-svg" viewBox="0 0 120 64" aria-hidden="true">
      <path class="shell left" d="M8 32 C8 12, 28 4, 58 8 C40 20, 36 44, 58 56 C28 60, 8 52, 8 32 Z" />
      <path class="shell right" d="M112 32 C112 12, 92 4, 62 8 C80 20, 84 44, 62 56 C92 60, 112 52, 112 32 Z" />
      <circle cx="34" cy="28" r="2.2" class="dot" />
      <circle cx="44" cy="40" r="1.6" class="dot" />
      <circle cx="78" cy="26" r="2" class="dot" />
      <circle cx="88" cy="38" r="1.5" class="dot" />
    </svg>
  `;
  return wrap;
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** Standard copy block: eyebrow, wordmark, crackable fortune, copy, footer. */
export function teaser(root, { tone, eyebrow, fine } = {}) {
  const card = el("section", "card");
  if (eyebrow) card.append(el("p", "eyebrow", eyebrow));
  card.append(wordmark(tone));

  const cookie = crackShell();
  const lede = el("p", "lede", pickFortune());
  lede.title = "Tap the cookie for another fortune";
  cookie.append(lede);
  card.append(cookie);

  const actions = el("div", "fortune-actions");
  const hint = el("p", "cookie-hint", "tap cookie to crack another");
  const copyBtn = el("button", "copy-fortune", "copy fortune");
  copyBtn.type = "button";
  actions.append(hint, copyBtn);
  card.append(actions);

  if (fine) card.append(el("p", "fine", fine));
  card.append(footer());
  root.append(card);

  let busy = false;
  cookie.addEventListener("click", () => {
    if (busy) return;
    busy = true;
    cookie.classList.remove("cracking");
    void cookie.offsetWidth;
    cookie.classList.add("cracking");
    window.setTimeout(() => {
      lede.textContent = pickFortune();
      lede.classList.remove("pop");
      void lede.offsetWidth;
      lede.classList.add("pop");
      busy = false;
      window.setTimeout(() => cookie.classList.remove("cracking"), 450);
    }, 180);
  });

  copyBtn.addEventListener("click", async () => {
    const payload = `${lede.textContent} - heyfran.com`;
    const ok = await copyText(payload);
    copyBtn.textContent = ok ? "copied" : "copy failed";
    window.setTimeout(() => {
      copyBtn.textContent = "copy fortune";
    }, 1400);
  });

  return card;
}
