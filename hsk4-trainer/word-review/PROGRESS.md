# HSK Vocabulary Review — Progress

Goal: for every word in every HSK level, propose a more succinct English gloss and flag any entries where the current definition looks outright wrong (not just verbose) for the app's context.

Each level's output: `word-review/hsk{N}_review.csv` — columns `#, Hanzi, Pinyin, Current English, Proposed English, Notes`. Notes is only filled in for flagged entries.

## Status

| Level | Words | Status | File | Flagged |
|---|---|---|---|---|
| HSK1 | 300 | Done | hsk1_review.csv | 7 |
| HSK2 | 200 | Done | hsk2_review.csv | 6 |
| HSK3 | 500 | Done | hsk3_review.csv | 7 |
| HSK4 | 1000 | Done | hsk4_review.csv | 9 |
| HSK5 | 1600 | Done | hsk5_review.csv | 19 |
| HSK6 | 1800 | Done | hsk6_review.csv | 23 |
| HSK7-9 | 5611 | Done | hsk7to9_review.csv | 55 |

**Note on method:** an earlier attempt delegated HSK3–7-9 to 7 parallel background agents; all 7 failed (API stream errors, 10-minute stalls, and one scratch-file collision between agents). Their partial/fragmented output was discarded as unreliable rather than stitched together. Proceeding level-by-level directly instead, same method as HSK1/HSK2.

## Flagged so far

**HSK1** (7): 大学 (should be "university"), 和 (missing "and/with"), 日 (should be "day/sun"), 书 (should be "book"), 新 (should be "new"), 元 (should be "yuan/currency"), 只 (should be "measure word for animals")

**HSK2** (6): 比 (should be "to compare/than"), 周 (should be "week"), 本子/奶奶/绿茶/机场 (inappropriate slang mixed into otherwise-fine definitions)

**HSK3** (7): 加 (should be "to add/plus"), 马 (should be "horse"), 越 (should be "more and more/increasingly"), 冰/干/鸡 (inappropriate slang mixed into otherwise-fine definitions), 只有 (garbled/truncated example text mixed into definition)

**HSK4** (9): 成功/树林/友好 (all picked obscure Taiwan/PRC place names instead of the common word meaning — "success", "woods/grove", "friendly"), 满 (should be "full", not "Manchu ethnic group"), 美 (missing "beautiful" entirely), 克 (missing "gram" entirely), 土 (should be "earth/soil/local", not "Tu ethnic group"), 台 (missing "platform/stage" senses), 凉 (missing "cool", only gives a historical dynasty name)

**HSK5** (19): place/brand-name mismatches — 大众 ("Volkswagen" → "the public/masses"), 时代 ("Time magazine" → "era/age"), 现代 ("Hyundai" → "modern"), 延长 (county name → "to extend"), 资源 (county name → "resources"), 原 (Japanese surname → "original/former"), 直 (mythological figure → "straight"); missing-common-meaning — 福/哈/黑/齐/青/诗/雨水 (each only gave an abbreviation or technical term, missing the everyday word); inappropriate slang mixed in — 玻璃/靠/小姐/鸭子; data glitch — 没法儿 (stray "5" in pinyin field, malformed English)

**HSK6** (23): place-name mismatches — 长寿/大都/方言/富裕/和平/互助/通道/新兴 (all real Chinese counties/districts or a book title got confused for the common word — most notably 和平 which should just be "peace"); brand-name mismatches — 联想 ("Lenovo" → "to associate ideas"), 赖 ("LINE app" → "to rely on/blame"), 塞 ("Serbia" → "to stuff"), 印 ("India abbr." → "seal/stamp"); missing-common-meaning — 井 ("well"), 密 ("dense/secret"); inappropriate slang mixed in — 逼/菊花/轮子/绿化; garbled/broken data — 夸 ("used in 克"), 神 ("God; abbr. for 舟"), 下功夫 ("see 夫"), 婴儿 (stray "lead (Pb)"), 小偷儿 (pinyin "xiǎotōur5", malformed English "Thief")

**HSK7-9** (55, the largest level at 5611 words): recurring place-name mismatches (a real Chinese county/district/city name got confused for the common word) — 安定/滨海/丰满/凤凰/复兴/高明/光泽/牡丹/平和/天桥/威信/温泉/振兴, plus repeats of the HSK6 issue on 方言/富裕/互助; brand/proper-noun mismatches — 标致 ("Peugeot" → "good-looking/pretty"), 头条 (Toutiao app → "top news story/headline"), 张扬 (film director's name → "to publicize/ostentatious"); missing-common-meaning (only an obscure/technical sense was given) — 墨 ("ink"), 苗 ("seedling/sprout/vaccine"), 哦 ("oh! I see"), 哑 ("mute/dumb"), 扬 ("to raise/spread"), 筑 ("to build"), 壮 ("strong/robust"), 来宾 ("guest/visitor"), 空地 ("vacant land" — was defined as an unrelated military term), 攒 (rare reading "cuán" instead of common "zǎn", "to save up money"); garbled/broken cross-references — 得意扬扬, 港, 水灵灵, 泰斗, 下功夫 (repeat from HSK6), 无可厚非, 效仿, 抑扬顿挫, 做证; malformed data (stray digit in pinyin and/or a single garbled English word) — 难以想象 ("Unimaginable"), 说起来 ("Say"), 贪玩儿 ("Greedy", pinyin "tānwánr5"), 致力于 ("Dedicate"), 着眼于 ("Focus on"); inappropriate/irrelevant content mixed in — 菊花 (repeat from HSK6), 破案 (random "shabby old table"), 能人 ("Homo habilis" tangent), 猩猩 (dubious slang addition), 婴儿 (repeat from HSK6, stray "lead (Pb)"); likely mismatched sense — 仇 (rare reading given priority over common "hatred/enemy"), 拟 ("doubtful/suspicious" looks confused with 疑), 闺女 (garbled pinyin rendering), 美德 ("USA and Germany" country abbreviation → "virtue")

## All levels complete

Every HSK level (1 through 7-9) has now been reviewed — 10,711 words total across all six CSV files in this folder. 126 entries were flagged across all levels combined for containing an outright wrong/broken/inappropriate definition (as opposed to just being more verbose than necessary). No changes were made to the live app (`src/App.jsx`) — these CSVs are review artifacts only, for manual review before any real edits are applied.
