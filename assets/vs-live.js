/* vs-live.js - the sequence bench for learn-visual-storytelling-with-phoebe.
 *
 * Five real visuals about Daybreak's subscription churn, rendered as a real deck.
 * Everything the bench reports about ORDER, VOLUME and CLAIM COUNT is measured off
 * the rendered DOM - the numbers are read back out of the slides after they are
 * drawn, never looked up from a table. The only modelled figure is "time to the
 * point", and it is labelled as a model wherever it appears.
 *
 * Public API (window.VS_LIVE) exists so the course map and the session pages can be
 * verified against a live browser rather than against my memory of one.
 */
(function () {
  "use strict";

  /* ---------- the deck ------------------------------------------------ */
  /* `keep` marks the one claim that serves the conclusion. `cuttable` marks a
     slide that exists because somebody felt they owed the room a preamble. */
  var DECK = [
    { id: "method", kind: "setup", cuttable: true, keep: 0,
      title: "How we pulled the numbers",
      claims: ["The data covers fourteen months of subscription records.",
               "Three cohorts were excluded for incomplete billing."],
      body: "Source is the billing export joined to the roast catalogue. Records " +
            "before March use the old plan codes and were remapped by hand.",
      vis: "grid" },

    { id: "revenue", kind: "context", keep: 1,
      title: "Subscription revenue by month",
      claims: ["Revenue grew thirty one percent over the period.",
               "Growth flattened after month nine."],
      body: "Monthly recurring revenue across all plans, net of refunds.",
      vis: "line" },

    { id: "mix", kind: "context", cuttable: true, keep: 0,
      title: "Roast origin mix",
      claims: ["Guji is the second largest origin by volume.",
               "The mix has been stable since month four."],
      body: "Share of active subscriptions by roast origin.",
      vis: "stack" },

    { id: "churn", kind: "support", keep: 1,
      title: "Churn by cohort",
      claims: ["Overall churn is 4.1 percent a month.",
               "One cohort sits far above every other."],
      body: "Monthly churn rate by signup cohort, last complete quarter.",
      vis: "bars" },

    { id: "point", kind: "point", keep: 0,
      title: "Guji subscribers churn at three times the rest",
      claims: ["Guji auto-renew churns at 12.4 percent against 4.1 percent elsewhere."],
      body: "Pausing Guji auto-renew until the supply gap closes protects about " +
            "forty one thousand pounds of annual revenue.",
      vis: "compare" }
  ];

  /* The anti-lever's slide. Written the way these slides are actually written. */
  var CONTEXT_SLIDE = {
    id: "background", kind: "setup", cuttable: false, keep: 0,
    title: "Background and approach",
    claims: ["Subscriptions have been a strategic priority since the March offsite.",
             "This analysis was requested by the retention working group.",
             "Methodology follows the cohort framework agreed in April."],
    body: "Before the findings it is worth setting out where this work sits. The " +
          "retention working group was stood up to look across the subscription " +
          "base, and this deck covers the first phase of that review.",
    vis: "grid"
  };

  var LEVERS = [
    { id: "oneclaim",    label: "One claim per visual",
      note: "Show only the claim that serves the point." },
    { id: "cutsetup",    label: "Cut the slides that serve nobody",
      note: "Drop the preamble and the slide nobody asked about." },
    { id: "answerfirst", label: "Put the answer first",
      note: "Move the conclusion to slide one." },
    { id: "callout",     label: "Write the claim on the visual",
      note: "Annotate each chart with what it shows." },
    { id: "contextfirst", label: "Add a context slide first", anti: true,
      note: "The one everybody asks for." }
  ];

  var on = { oneclaim: false, cutsetup: false, answerfirst: false,
             callout: false, contextfirst: false };

  var rows = {}, stage = null, readout = null;
  var WPM = 160, DWELL = 15;   /* the model's two constants, stated on the page */

  /* ---------- tiny visuals -------------------------------------------- */
  /* Deliberately small and plain. This course is about sequence, so a visual
     that competes for attention would be teaching the opposite lesson. */
  function vis(kind, callout) {
    var s = '<svg viewBox="0 0 260 84" role="img" aria-label="illustrative chart">';
    var i;
    if (kind === "line") {
      var pts = [6, 14, 20, 27, 34, 39, 45, 49, 52, 53, 54, 55, 55, 56];
      var d = "";
      for (i = 0; i < pts.length; i++)
        d += (i ? "L" : "M") + (10 + i * 17) + " " + (74 - pts[i]);
      s += '<path d="' + d + '" fill="none" stroke="#7A2E4E" stroke-width="2.5"/>';
    } else if (kind === "stack") {
      var w = [96, 66, 52, 32], x = 10;
      var tone = ["#7A2E4E", "#9C5772", "#D9AFBF", "#EADCE2"];
      for (i = 0; i < w.length; i++) {
        s += '<rect x="' + x + '" y="26" width="' + (w[i] - 4) + '" height="30" fill="' + tone[i] + '"/>';
        x += w[i];
      }
    } else if (kind === "bars") {
      var h = [18, 22, 20, 24, 19, 21];
      for (i = 0; i < h.length; i++)
        s += '<rect x="' + (12 + i * 40) + '" y="' + (74 - h[i]) + '" width="26" height="' + h[i] + '" fill="#9C5772"/>';
    } else if (kind === "compare") {
      s += '<rect x="18" y="20" width="52" height="54" fill="#2E9E8F"/>';
      s += '<rect x="96" y="56" width="52" height="18" fill="#D9AFBF"/>';
      s += '<rect x="174" y="57" width="52" height="17" fill="#D9AFBF"/>';
    } else {
      for (i = 0; i < 12; i++)
        s += '<rect x="' + (10 + (i % 6) * 40) + '" y="' + (24 + Math.floor(i / 6) * 26) +
             '" width="34" height="18" fill="#EADCE2"/>';
    }
    if (callout)
      s += '<text class="vs-callout" x="6" y="14" font-size="10" font-weight="700" fill="#14544B">' +
           esc(callout) + "</text>";
    return s + "</svg>";
  }

  function esc(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* A callout has to fit on a chart, so it is the claim shortened to its spine.
     Truncating mid-word would be a rendering bug the learner would read as a
     lesson, so cut on a word boundary. */
  function shorten(t, n) {
    t = t.replace(/\.$/, "");
    if (t.length <= n) return t;
    return t.slice(0, t.lastIndexOf(" ", n)) + "...";
  }

  /* ---------- assemble the deck for the current levers ---------------- */
  function assemble() {
    var d = DECK.slice();
    if (on.cutsetup) d = d.filter(function (s) { return !s.cuttable; });
    if (on.answerfirst) {
      var p = d.filter(function (s) { return s.kind === "point"; });
      d = p.concat(d.filter(function (s) { return s.kind !== "point"; }));
    }
    /* The context slide goes first even when the answer was put first - that is
       exactly what happens in the room, and it is the point of the anti-lever. */
    if (on.contextfirst) d = [CONTEXT_SLIDE].concat(d);
    return d;
  }

  function claimsFor(s) {
    return on.oneclaim ? [s.claims[Math.min(s.keep, s.claims.length - 1)]] : s.claims;
  }

  /* ---------- paint ---------------------------------------------------- */
  function paint() {
    var deck = assemble(), html = "", i;
    for (i = 0; i < deck.length; i++) {
      var s = deck[i], cl = claimsFor(s);
      var callout = on.callout ? shorten(cl[0], 34) : "";
      html += '<article class="vs-slide' + (s.kind === "point" ? " is-point" : "") +
              '" data-kind="' + s.kind + '" data-id="' + s.id + '">' +
              '<div class="vs-num">' + (i + 1) + "</div>" +
              '<h4 class="vs-title">' + esc(s.title) + "</h4>" +
              '<div class="vs-vis">' + vis(s.vis, callout) + "</div>" +
              '<ul class="vs-claims">';
      for (var j = 0; j < cl.length; j++)
        html += '<li class="vs-claim">' + esc(cl[j]) + "</li>";
      html += "</ul><p class=\"vs-body\">" + esc(s.body) + "</p></article>";
    }
    stage.innerHTML = html;
    measure();
  }

  /* ---------- measure the rendered deck -------------------------------- */
  /* Read the numbers back out of the DOM. If a lever silently failed to change
     the deck, this reports the truth rather than what the lever intended. */
  function words(el) {
    var t = (el.textContent || "").replace(/\s+/g, " ").trim();
    return t ? t.split(" ").length : 0;
  }

  var out = { pointAt: 0, slides: 0, wordsBefore: 0, wordsTotal: 0,
              claims: 0, labelled: 0, seconds: 0 };

  function measure() {
    var slides = [].slice.call(stage.querySelectorAll(".vs-slide"));
    var pointIdx = -1, before = 0, total = 0, i;
    for (i = 0; i < slides.length; i++) {
      var w = words(slides[i]);
      total += w;
      if (pointIdx < 0) before += w;
      if (slides[i].getAttribute("data-kind") === "point" && pointIdx < 0) pointIdx = i;
    }
    out.slides = slides.length;
    out.pointAt = pointIdx + 1;
    out.wordsBefore = before;
    out.wordsTotal = total;
    out.claims = stage.querySelectorAll(".vs-claim").length;
    out.labelled = stage.querySelectorAll("text.vs-callout").length;
    /* MODEL, not a measurement: reading rate plus a fixed dwell per slide. */
    out.seconds = Math.round(before / WPM * 60 + out.pointAt * DWELL);
    render();
  }

  function grade() {
    if (out.pointAt <= 1 && out.claims <= out.slides) return ["good", "The point lands first"];
    if (out.pointAt <= 2) return ["ok", "The point lands early"];
    if (out.pointAt >= out.slides) return ["bad", "The point lands last"];
    return ["ok", "The point is buried mid-deck"];
  }

  function render() {
    var g = grade();
    readout.innerHTML =
      '<div class="vs-verdict is-' + g[0] + '">' + g[1] + "</div>" +
      '<div class="vs-metrics">' +
        metric("The point lands at", out.pointAt + " of " + out.slides, "slide", "measured") +
        metric("Words before the point", out.wordsBefore, "words", "measured") +
        metric("Distinct claims", out.claims, "across " + out.slides + " visuals", "measured") +
        metric("Visuals carrying their claim", out.labelled + " of " + out.slides, "labelled", "measured") +
        metric("Time to the point", out.seconds + "s", "at " + WPM + " wpm + " + DWELL + "s a slide", "model") +
      "</div>";
  }

  function metric(label, value, unit, kind) {
    return '<div class="vs-metric"><span class="vs-mlabel">' + label + "</span>" +
           '<span class="vs-mvalue">' + value + "</span>" +
           '<span class="vs-munit">' + unit + "</span>" +
           '<span class="vs-mkind is-' + kind + '">' + kind + "</span></div>";
  }

  /* ---------- levers ---------------------------------------------------- */
  /* One place that owns a lever change, so the checkbox and the API cannot
     drift apart - the API is what the course map's numbers were derived with. */
  function setLever(id, v) {
    if (!(id in on)) return;
    on[id] = !!v;
    if (rows[id]) rows[id].checked = !!v;
    paint();
  }

  function reset() {
    Object.keys(on).forEach(function (k) { setLever(k, false); });
  }

  function build(root) {
    var panel = document.createElement("div");
    panel.className = "vs-levers";
    LEVERS.forEach(function (l) {
      var id = "vs-" + l.id;
      var lab = document.createElement("label");
      lab.className = "vs-lever" + (l.anti ? " is-anti" : "");
      lab.innerHTML = '<input type="checkbox" id="' + id + '"><span class="vs-lname">' +
        esc(l.label) + (l.anti ? ' <em class="vs-anti">the one everybody asks for</em>' : "") +
        '</span><span class="vs-lnote">' + esc(l.note) + "</span>";
      panel.appendChild(lab);
      var cb = lab.querySelector("input");
      rows[l.id] = cb;
      cb.addEventListener("change", function () { setLever(l.id, cb.checked); });
    });

    var bar = document.createElement("div");
    bar.className = "vs-bar";
    var rb = document.createElement("button");
    rb.type = "button"; rb.className = "vs-reset"; rb.textContent = "Reset to how it was presented";
    rb.addEventListener("click", reset);
    bar.appendChild(rb);

    readout = document.createElement("div");
    readout.className = "vs-readout";
    stage = document.createElement("div");
    stage.className = "vs-stage";

    root.appendChild(panel);
    root.appendChild(bar);
    root.appendChild(readout);
    root.appendChild(stage);
    paint();
  }

  function init() {
    var root = document.getElementById("vs-bench");
    if (!root) return;
    build(root);
    window.VS_LIVE = {
      state: on,
      set: setLever,
      reset: reset,
      get metrics() { return out; },
      get order() {
        return [].slice.call(stage.querySelectorAll(".vs-slide")).map(function (s) {
          return s.getAttribute("data-id");
        });
      }
    };
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
