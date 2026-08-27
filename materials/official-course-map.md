# learn-visual-storytelling-with-phoebe · source map

Every constant, every measured number, and the honest limits of the bench.
by Phoebe Fu

---

## The course in one line

The analysis is right and the charts are honest. This course is the other half:
the one sentence, the order, and what to make loud.

**Running situation:** Daybreak's Guji churn finding. The seventh course on the same
company, after SQL, system design, product design, communication, course design and
data visualization.

---

## Scope boundaries (decided before the first page was written)

| Question | Owning course |
|---|---|
| Which encoding, and is the chart honest? | `learn-dataviz-with-phoebe` |
| The ask, listening first, bad news | `learn-communication-with-phoebe` |
| Reading a metric and questioning it | `learn-data-literacy-with-phoebe` |
| Designing a session people learn from | `learn-course-design-with-phoebe` |
| **Turning correct visuals into a decision** | **here** |

**Session 6 is "Four tellings", not "four containers".** `learn-dataviz-with-phoebe`
session 6 already owns rendering containers - slide, doc, phone, print. This session
owns the story changing shape for a different audience: spoken, memo, read-alone deck,
message. The names were deliberately made distinct so the two do not drift into each
other.

---

## Sessions

| # | Title | Signature thing |
|---|---|---|
| 1 | The one sentence | Four parts, four tests, four honest blockers |
| 2 | Structure | Pyramid vs situation-and-turn; where chronological is genuinely right |
| 3 | One idea per visual | The takeaway title and the titles-only test |
| 4 | Emphasis | Five channels ranked by pull; the three-second test |
| 5 | **Sequence and pacing** | **The bench** |
| 6 | Four tellings | Spoken first, message last, final scorecard |

---

## The bench (`assets/vs-live.js`)

A five-slide deck about Daybreak, rendered as real DOM. Four properties are read back
out of the rendered slides after they are drawn. One is a model and is labelled as one
on the widget itself.

### What is measured

| Metric | How |
|---|---|
| Where the point lands | Index of `[data-kind="point"]` among rendered `.vs-slide` elements |
| Words before the point | `textContent` of every slide up to and including the point, whitespace-split |
| Distinct claims | Count of rendered `.vs-claim` elements |
| Visuals carrying their claim | Count of `text.vs-callout` elements in the rendered SVGs |

### What is modelled

| Metric | Formula | Constants |
|---|---|---|
| Time to the point | `wordsBefore / WPM * 60 + pointAt * DWELL` | `WPM = 160`, `DWELL = 15` |

Both constants are chosen, stated on the widget, and are not findings. 160 wpm is a
conservative mid-range spoken rate; 15 seconds a slide is a plausible dwell, not a
measurement of anybody.

### The levers

| id | Label | What it does |
|---|---|---|
| `oneclaim` | One claim per visual | Renders only `claims[keep]` on each slide |
| `cutsetup` | Cut the slides that serve nobody | Filters out slides marked `cuttable` |
| `answerfirst` | Put the answer first | Moves the `point` slide to index 0 |
| `callout` | Write the claim on the visual | Adds a `text.vs-callout` carrying the shortened claim |
| `contextfirst` | **ANTI** Add a context slide first | Unshifts a three-claim background slide |

`setLever()` is the single owner of a lever change, so the checkbox and the `VS_LIVE`
API cannot drift apart. The ladder below was derived through the API.

### Verified ladder

Derived in a real browser before any page quoted it. Cumulative, in this order.

| State | Point lands | Words before | Claims | Labelled | Time (model) |
|---|---|---|---|---|---|
| As presented | 5 of 5 | 142 | 9 | 0 | 128s |
| + one claim per visual | 5 of 5 | 116 | 5 | 0 | 119s |
| + cut the slides serving nobody | 3 of 3 | 66 | 3 | 0 | 70s |
| + put the answer first | **1 of 3** | **33** | 3 | 0 | 27s |
| + claim written on the visual | 1 of 3 | 37 | 3 | 3 | 29s |
| **then add one context slide** | 2 of 4 | **86** | 4 | 4 | 62s |

### Each lever alone, from as-presented

Every lever moves at least one number on its own. A lever that only works in
combination teaches the learner nothing about that lever.

| Only | Point lands | Words before | Claims | Labelled | Time |
|---|---|---|---|---|---|
| `oneclaim` | 5 of 5 | 116 | 5 | 0 | 119s |
| `cutsetup` | 3 of 3 | 79 | 5 | 0 | 75s |
| `answerfirst` | 1 of 5 | 33 | 9 | 0 | 27s |
| `callout` | 5 of 5 | **165** | 9 | 5 | 137s |
| `contextfirst` | **6 of 6** | **203** | 12 | 0 | 166s |

Two rows carry the session's hardest lessons:

- **`callout` alone raises the word count**, 142 to 165. This is correct and it is
  quoted as a real trade rather than hidden. Words-before-the-point is a cost measure,
  not a quality score. The same lever costs 23 words on the bad deck and 4 on the fixed
  one, because on the bad deck it is labelling slides that should not exist.
- **`contextfirst` alone is the worst single state in the bench.** One requested slide
  pushes the point to the last position of a longer deck and adds 61 words.

### Honest limits

- **Word count is not comprehension.** A 33-word road to the point can still be
  unclear. The bench measures distance, not quality.
- **The deck is a teaching artefact.** Five slides with short bodies. A real deck has
  more words per slide, so absolute figures will be larger; the ratios are the lesson.
- **"Distinct claims" counts rendered claim elements**, which is a proxy. A single
  sentence can smuggle in two assertions and the bench will count it once.
- **The verdict line is a heuristic**, not a measurement: good if the point lands first
  and claims do not exceed slides, bad if it lands last.
- **The time figure is a model** and is labelled as such in the widget markup, not only
  in prose.

---

## Design system

| Token | Value | Role |
|---|---|---|
| `--indigo` | `#7A2E4E` | Plum-wine accent, page chrome |
| `--indigo-deep` | `#4E1B31` | Headings, root of the mindmap |
| `--amber` | `#2E9E8F` | Jade flagship: the point slide, measured badges |
| `--ink` | `#2B1520` | Body text |
| `--paper` | `#FCF9FA` | Surface |

Body line-height 1.85. Attribution "by Phoebe Fu". Hyphens only, never an em or en
dash. `?v=` bumped on every css/js change, because Pages caches hard.

The bench's own slide visuals use `#7A2E4E`, `#9C5772`, `#D9AFBF`, `#EADCE2` and the
jade `#2E9E8F` for the point. They are deliberately plain: this course is about
sequence, so a visual competing for attention would teach the opposite lesson.

---

## Lineage named in the pages

| Source | Where | How it is treated |
|---|---|---|
| Minto's answer-first pyramid | Session 2 | Named as the lineage of the pyramid skeleton |
| Freytag and story arcs | Session 2 | Named as the origin of the build-to-it instinct, and why it does not transfer |
| Cognitive load theory | Session 3 | Named as the mechanism behind the split, not lectured |
| Preattentive attributes | Session 4 | Named; the full treatment lives in `learn-dataviz-with-phoebe` |
| Reading-rate research | Session 5 | The 160 wpm constant, named as chosen rather than found |
