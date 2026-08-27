# learn-visual-storytelling-with-phoebe

**Six sessions on the half that happens after the analysis is right: the one sentence,
the order, and what to make loud.**

Live: https://phoebefu6.github.io/learn-visual-storytelling-with-phoebe/

Every chart in the deck is correct. The finding is on slide five of five, behind 142
words of setup and nine separate claims. Then somebody asks for a bit of context at the
front, and the point moves to slide six of six behind 203 words.

Running situation: **Daybreak's Guji churn finding**, the seventh course on the same
company.

## What this course is not

| Question | Course |
|---|---|
| Which encoding, and is the chart honest? | `learn-dataviz-with-phoebe` |
| The ask, listening first, bad news | `learn-communication-with-phoebe` |
| How do I read a metric and question it? | `learn-data-literacy-with-phoebe` |
| **The charts are right. How do I make them change a decision?** | **here** |

**Session 6 is "Four tellings", not "four containers".** Rendering across slide, doc,
phone and print belongs to `learn-dataviz-with-phoebe` session 6. This one is about the
story changing shape for a different audience: spoken, memo, read-alone deck, message.

## Sessions

1. The one sentence - four parts, four tests, four honest blockers
2. Structure - why the reveal fails in a meeting, and the two shapes that work
3. One idea per visual - the takeaway title, and the fear of looking thin
4. Emphasis - add it by removing it; five channels ranked by pull
5. **Sequence and pacing** - the bench
6. Four tellings - spoken first, message last

## The bench

`assets/vs-live.js`. A five-slide deck rendered as real DOM, with **four things read
back out of the rendered slides** and one labelled model:

| State | Point lands | Words before | Claims |
|---|---|---|---|
| as presented | 5 of 5 | **142** | 9 |
| + one claim per visual | 5 of 5 | 116 | 5 |
| + cut the setup | 3 of 3 | 66 | 3 |
| + answer first | **1 of 3** | **33** | 3 |
| **anti: add a context slide** | 2 of 4 | **86** | 4 |

Two levers are worth the visit on their own:

- **`callout` alone raises the word count**, 142 to 165. That is a real trade and the
  bench does not hide it. Words-before-the-point is a cost measure, not a score.
- **`contextfirst` alone** puts the point on slide **6 of 6** behind **203 words**. The
  most reasonable-sounding request in corporate life, measured.

Time to the point is the only modelled figure (160 wpm plus 15s a slide) and is
labelled `model` on the widget itself, next to four badges reading `measured`.

## Structure

```
index.html                        landing, mindmap, paths
courses/01..06-*.html             the six sessions
assets/style.css                  editorial-bold, plum-wine + jade
assets/vs-live.js                 the sequence bench
assets/app.js  assets/mindmap.js
materials/official-course-map.md  source map, every constant, honest limits
```

Static HTML, no build step:

```bash
python3 -m http.server 8000
```

by Phoebe Fu · part of [Learn with Phoebe](https://phoebefu6.github.io/learn-with-phoebe/)
