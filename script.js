/* ===== EDIT EVENT DETAILS HERE ===== */
const CONFIG = {
  EVENT_NAME: "Narsee Monjee Model United Nations",
  season: "2026–27",
  dates: "January 18–19",
  theme: "NMMUN '27 (18th Edition)",
  venue: "SVKM's NMIMS Shirpur Campus, Mukesh Patel Technology Park, Babulde, Near Tapi River Bridge, Mumbai-Agra Highway NH-3, Shirpur, Dhule, Maharashtra",
  venueShort: "SVKM's NMIMS Shirpur Campus",
  REGISTRATION_URL: "",              // paste your link; empty = placeholder
  email: "Shirpur@nmims.edu",
  insta: "https://linktr.ee/nmims.shirpur"
};
const COMMITTEES = [
  ["UNGA","General Assembly","Broad debate on global cooperation and development.","[Agenda TBA]","Beginner","[X]"],
  ["UNHRC","Human Rights Council","Rights, accountability and state responsibility.","[Agenda TBA]","Intermediate","[X]"],
  ["DISEC","Disarmament & Security","Arms control, conflict prevention and international security.","[Agenda TBA]","Beginner","[X]"],
  ["WHO","Specialised Agency","Public health policy and global health governance.","[Agenda TBA]","Intermediate","[X]"],
  ["UNESCO","Specialised Agency","Education, science and the protection of heritage.","[Agenda TBA]","Beginner","[X]"],
  ["AIPPM","All India Political Parties Meet","Domestic politics, party positions and legislation.","[Agenda TBA]","Intermediate","[X]"],
  ["UNSC","Security Council","Binding resolutions, veto power and high-stakes negotiation.","[Agenda TBA]","Advanced","[X]"],
  ["Crisis","Crisis Committee","Fast-moving scenarios driven by directives and updates.","[Agenda TBA]","Advanced","[X]"]
];
const FAQS = [
 ["What is Model United Nations?","A simulation of the United Nations and other bodies where students represent countries, debate global issues and draft resolutions."],
 ["Who can participate?","Students from any school or college. Eligibility details will be confirmed on the registration page."],
 ["Do I need previous MUN experience?","No. Beginner-friendly committees are available and chairs guide first-time delegates through procedure."],
 ["How do committee allocations work?","Delegates submit preferences at registration. The Secretariat assigns committees and countries and emails the allocation with a background guide."],
 ["What should I wear?","Western business formals, as in a real diplomatic setting."],
 ["What should I prepare before the conference?","Read the background guide, research your country's policy and draft an opening statement."],
 ["Are certificates provided?","Yes. Participation certificates for all delegates and awards for top performers. [Confirm with organisers]"],
 ["How can I register?","Use any Register Now button on this page. It opens the official registration form."]
];
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

/* Fill config values */
CONFIG.venueShort = CONFIG.venueShort;
$$("[data-cfg]").forEach(e => { if (CONFIG[e.dataset.cfg]) e.textContent = CONFIG[e.dataset.cfg]; });
$$("[data-cfg-href]").forEach(e => { const k = e.dataset.cfgHref; e.href = k==="mailto" ? "mailto:"+CONFIG.email : CONFIG.insta; });
$$("[data-reg]").forEach(a => {
  if (CONFIG.REGISTRATION_URL) { a.href = CONFIG.REGISTRATION_URL; a.target = "_blank"; a.rel = "noopener"; }
  else a.addEventListener("click", e => { e.preventDefault(); alert("Registration link coming soon. Set REGISTRATION_URL in script.js."); });
});

/* Nav */
const nav = $("#nav"), menu = $("#menu"), burger = $("#burger");
const setMenu = o => { menu.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); document.body.style.overflow = o ? "hidden" : ""; };
burger.onclick = () => setMenu(!menu.classList.contains("open"));
$$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => e.key==="Escape" && setMenu(false));
addEventListener("scroll", () => {
  nav.classList.toggle("solid", scrollY > 40);
  $("#progress").style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + "%";
}, {passive:true});

/* Committees */
const box = $("#chambers");
COMMITTEES.forEach((c,i) => {
  const b = document.createElement("button");
  b.className = "ch"; b.setAttribute("aria-expanded","false");
  b.innerHTML = `<span class="type">${c[1]}</span><h3>${c[0]}</h3><div class="more"><p>${c[2]}</p><dl><dt>Agenda</dt><dd>${c[3]}</dd><dt>Difficulty</dt><dd>${c[4]}</dd><dt>Capacity</dt><dd>${c[5]} delegates</dd></dl></div>`;
  b.onclick = () => $$(".ch").forEach(x => { const on = x===b && !b.classList.contains("open"); x.classList.toggle("open", on); x.setAttribute("aria-expanded", on); });
  box.append(b);
});
box.firstChild.classList.add("open");

/* FAQ with animated height */
const fl = $("#faqList");
FAQS.forEach(([q,a]) => {
  const d = document.createElement("details");
  d.innerHTML = `<summary>${q}</summary><div class="a"><p>${a}</p></div>`;
  const panel = $(".a", d);
  $("summary", d).addEventListener("click", e => {
    e.preventDefault();
    if (d.open) { panel.style.height = panel.scrollHeight+"px"; requestAnimationFrame(()=>panel.style.height="0"); setTimeout(()=>d.open=false,350); }
    else { d.open = true; panel.style.height = panel.scrollHeight+"px"; setTimeout(()=>panel.style.height="auto",350); }
  });
  fl.append(d);
});

/* Schedule line reveal */
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add("in")), {threshold:.3});
$$(".day").forEach(d => io.observe(d));

/* Hero: rotating dotted globe */
(() => {
  const c = $("#globe"), x = c.getContext("2d");
  if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  let w, h, t = 0, pts = [];
  for (let la=-80; la<=80; la+=8) for (let lo=0; lo<360; lo+=8/Math.cos(la*Math.PI/180)) pts.push([la*Math.PI/180, lo*Math.PI/180]);
  const fit = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
  fit(); addEventListener("resize", fit);
  (function draw(){
    x.clearRect(0,0,w,h);
    const r = Math.min(w,h)*.42, cx = w>800 ? w*.68 : w*.5, cy = h*.5;
    t += .002;
    pts.forEach(([la,lo]) => {
      const a = lo+t, px = Math.cos(la)*Math.sin(a), py = Math.sin(la), pz = Math.cos(la)*Math.cos(a);
      if (pz < 0) return;
      x.fillStyle = `rgba(201,164,92,${.15+pz*.45})`;
      x.fillRect(cx+px*r, cy-py*r, 1.8, 1.8);
    });
    x.strokeStyle = "rgba(245,241,232,.12)"; x.beginPath(); x.arc(cx,cy,r,0,7); x.stroke();
    requestAnimationFrame(draw);
  })();
})();
