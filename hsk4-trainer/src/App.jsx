import { useState, useEffect, useRef } from "react";
const HSK4_WORDS = [
  { hanzi: "啊", pinyin: "ā", english: "ah, oh" },
  { hanzi: "爱情", pinyin: "àiqíng", english: "love" },
  { hanzi: "爱心", pinyin: "àixīn", english: "compassion, caring" },
  { hanzi: "安检", pinyin: "ānjiǎn", english: "security check" },
  { hanzi: "安排", pinyin: "ānpái", english: "to arrange" },
  { hanzi: "按", pinyin: "àn", english: "to press; according to" },
  { hanzi: "按时", pinyin: "ànshí", english: "on time, on schedule" },
  { hanzi: "按照", pinyin: "ànzhào", english: "according to, in accordance with" },
  { hanzi: "白酒", pinyin: "báijiǔ", english: "liquor, spirit" },
  { hanzi: "办公", pinyin: "bàngōng", english: "to handle official business" },
  { hanzi: "办理", pinyin: "bànlǐ", english: "to handle, to process" },
  { hanzi: "办事", pinyin: "bànshì", english: "to handle matters" },
  { hanzi: "棒", pinyin: "bàng", english: "great, excellent" },
  { hanzi: "保护", pinyin: "bǎohù", english: "to protect" },
  { hanzi: "保证", pinyin: "bǎozhèng", english: "to guarantee; guarantee" },
  { hanzi: "抱", pinyin: "bào", english: "to hold, to embrace, to hug" },
  { hanzi: "报考", pinyin: "bàokǎo", english: "to apply for an exam" },
  { hanzi: "报名", pinyin: "bàomíng", english: "to sign up, to register" },
  { hanzi: "抱歉", pinyin: "bàoqiàn", english: "sorry, apologetic" },
  { hanzi: "背", pinyin: "bēi", english: "to carry on the back" },
  { hanzi: "背包", pinyin: "bēibāo", english: "backpack" },
  { hanzi: "北部", pinyin: "běibù", english: "northern part, north" },
  { hanzi: "倍", pinyin: "bèi", english: "times, -fold" },
  { hanzi: "本科", pinyin: "běnkē", english: "undergraduate program" },
  { hanzi: "本来", pinyin: "běnlái", english: "originally, actually" },
  { hanzi: "笨", pinyin: "bèn", english: "stupid, foolish" },
  { hanzi: "鼻子", pinyin: "bízi", english: "nose" },
  { hanzi: "笔试", pinyin: "bǐshì", english: "written test" },
  { hanzi: "毕业", pinyin: "bìyè", english: "to graduate" },
  { hanzi: "毕业生", pinyin: "bìyèshēng", english: "graduate" },
  { hanzi: "便于", pinyin: "biànyú", english: "to be convenient for" },
  { hanzi: "标准", pinyin: "biāozhǔn", english: "standard" },
  { hanzi: "表", pinyin: "biǎo", english: "watch, form, table" },
  { hanzi: "表格", pinyin: "biǎogé", english: "form, table" },
  { hanzi: "表示", pinyin: "biǎoshì", english: "to express, to indicate" },
  { hanzi: "表现", pinyin: "biǎoxiàn", english: "to show, to display, to perform" },
  { hanzi: "表扬", pinyin: "biǎoyáng", english: "to praise, to commend" },
  { hanzi: "饼干", pinyin: "bǐnggān", english: "biscuit, cracker" },
  { hanzi: "并", pinyin: "bìng", english: "to combine; and, also" },
  { hanzi: "并且", pinyin: "bìngqiě", english: "and, moreover, furthermore" },
  { hanzi: "播放", pinyin: "bōfàng", english: "to broadcast, to play" },
  { hanzi: "博士", pinyin: "bóshì", english: "doctor (PhD)" },
  { hanzi: "不必", pinyin: "búbì", english: "need not, not necessary" },
  { hanzi: "不便", pinyin: "búbiàn", english: "inconvenient" },
  { hanzi: "不断", pinyin: "búduàn", english: "continuously, constantly" },
  { hanzi: "不够", pinyin: "búgòu", english: "not enough, insufficient" },
  { hanzi: "不过", pinyin: "búguò", english: "but, however (casual contrast)" },
  { hanzi: "不论", pinyin: "búlùn", english: "no matter, regardless" },
  { hanzi: "步", pinyin: "bù", english: "step, pace" },
  { hanzi: "部", pinyin: "bù", english: "department, part" },
  { hanzi: "不得不", pinyin: "bùdébù", english: "have to, cannot but" },
  { hanzi: "部分", pinyin: "bùfen", english: "part, portion" },
  { hanzi: "不管", pinyin: "bùguǎn", english: "no matter, regardless of" },
  { hanzi: "不光", pinyin: "bùguāng", english: "not only (colloquial)" },
  { hanzi: "不仅", pinyin: "bùjǐn", english: "not only (formal)" },
  { hanzi: "不满", pinyin: "bùmǎn", english: "dissatisfied, displeased" },
  { hanzi: "部门", pinyin: "bùmén", english: "department, unit (within an organization)" },
  { hanzi: "不如", pinyin: "bùrú", english: "not as good as, inferior to" },
  { hanzi: "擦", pinyin: "cā", english: "to wipe, to rub" },
  { hanzi: "猜", pinyin: "cāi", english: "to guess" },
  { hanzi: "材料", pinyin: "cáiliào", english: "material, data" },
  { hanzi: "参观", pinyin: "cānguān", english: "to visit, to tour" },
  { hanzi: "参赛", pinyin: "cānsài", english: "to enter a competition" },
  { hanzi: "餐厅", pinyin: "cāntīng", english: "restaurant, dining hall" },
  { hanzi: "操场", pinyin: "cāochǎng", english: "playground" },
  { hanzi: "厕所", pinyin: "cèsuǒ", english: "toilet, restroom" },
  { hanzi: "查看", pinyin: "chákàn", english: "to check, to view" },
  { hanzi: "茶叶", pinyin: "cháyè", english: "tea leaf" },
  { hanzi: "查找", pinyin: "cházhǎo", english: "to search for, to look up" },
  { hanzi: "差点儿", pinyin: "chàdiǎnr", english: "almost, nearly" },
  { hanzi: "产生", pinyin: "chǎnshēng", english: "to produce, to generate, to arise" },
  { hanzi: "厂", pinyin: "chǎng", english: "factory, plant" },
  { hanzi: "场", pinyin: "chǎng", english: "measure word for events" },
  { hanzi: "超过", pinyin: "chāoguò", english: "to exceed, to surpass" },
  { hanzi: "车速", pinyin: "chēsù", english: "vehicle speed" },
  { hanzi: "车位", pinyin: "chēwèi", english: "parking space" },
  { hanzi: "城", pinyin: "chéng", english: "city, town" },
  { hanzi: "乘", pinyin: "chéng", english: "to ride, to take" },
  { hanzi: "成功", pinyin: "chénggōng", english: "to succeed; successful" },
  { hanzi: "乘客", pinyin: "chéngkè", english: "passenger" },
  { hanzi: "诚实", pinyin: "chéngshí", english: "honest" },
  { hanzi: "成为", pinyin: "chéngwéi", english: "to become" },
  { hanzi: "乘坐", pinyin: "chéngzuò", english: "to ride, to take transportation" },
  { hanzi: "吃惊", pinyin: "chījīng", english: "to be startled, to be shocked" },
  { hanzi: "迟", pinyin: "chí", english: "late, delayed" },
  { hanzi: "重", pinyin: "chóng", english: "again, once more" },
  { hanzi: "重新", pinyin: "chóngxīn", english: "again, anew" },
  { hanzi: "出差", pinyin: "chūchāi", english: "to go on a business trip" },
  { hanzi: "出口", pinyin: "chūkǒu", english: "exit" },
  { hanzi: "出现", pinyin: "chūxiàn", english: "to appear, to emerge" },
  { hanzi: "出行", pinyin: "chūxíng", english: "to travel, to go out" },
  { hanzi: "出租", pinyin: "chūzū", english: "to rent out" },
  { hanzi: "厨房", pinyin: "chúfáng", english: "kitchen" },
  { hanzi: "厨师", pinyin: "chúshī", english: "chef, cook" },
  { hanzi: "窗", pinyin: "chuāng", english: "window" },
  { hanzi: "窗户", pinyin: "chuānghu", english: "window" },
  { hanzi: "吹", pinyin: "chuī", english: "to blow" },
  { hanzi: "词语", pinyin: "cíyǔ", english: "word, phrase" },
  { hanzi: "此", pinyin: "cǐ", english: "this" },
  { hanzi: "此次", pinyin: "cǐcì", english: "this time" },
  { hanzi: "此外", pinyin: "cǐwài", english: "besides, in addition, moreover" },
  { hanzi: "从此", pinyin: "cóngcǐ", english: "from then on, since then" },
  { hanzi: "从来", pinyin: "cónglái", english: "always, at all times" },
  { hanzi: "从中", pinyin: "cóngzhōng", english: "from among, from it" },
  { hanzi: "粗", pinyin: "cū", english: "coarse, rough, thick" },
  { hanzi: "粗心", pinyin: "cūxīn", english: "careless" },
  { hanzi: "村", pinyin: "cūn", english: "village" },
  { hanzi: "存", pinyin: "cún", english: "to store, to keep, to exist" },
  { hanzi: "错过", pinyin: "cuòguò", english: "to miss, to let slip" },
  { hanzi: "错误", pinyin: "cuòwù", english: "wrong; mistake, error" },
  { hanzi: "答应", pinyin: "dāying", english: "to agree, to promise, to reply" },
  { hanzi: "答", pinyin: "dá", english: "to answer, to reply" },
  { hanzi: "答案", pinyin: "dá\'àn", english: "answer, solution" },
  { hanzi: "达到", pinyin: "dádào", english: "to reach, to achieve" },
  { hanzi: "打招呼", pinyin: "dǎ zhāohu", english: "to greet, to say hello" },
  { hanzi: "打败", pinyin: "dǎbài", english: "to defeat, to beat" },
  { hanzi: "打工", pinyin: "dǎgōng", english: "to work a temporary job" },
  { hanzi: "打扰", pinyin: "dǎrǎo", english: "to disturb, to bother" },
  { hanzi: "打印", pinyin: "dǎyìn", english: "to print" },
  { hanzi: "打印机", pinyin: "dǎyìnjī", english: "printer" },
  { hanzi: "打折", pinyin: "dǎzhé", english: "to give a discount" },
  { hanzi: "打针", pinyin: "dǎzhēn", english: "to get an injection" },
  { hanzi: "大巴", pinyin: "dàbā", english: "large bus, coach" },
  { hanzi: "大大", pinyin: "dàdà", english: "greatly, significantly" },
  { hanzi: "大夫", pinyin: "dàifu", english: "doctor (medical)" },
  { hanzi: "大量", pinyin: "dàliàng", english: "large quantity, a large amount" },
  { hanzi: "大赛", pinyin: "dàsài", english: "major competition, grand contest" },
  { hanzi: "大厅", pinyin: "dàtīng", english: "hall, lobby" },
  { hanzi: "大约", pinyin: "dàyuē", english: "approximately, about" },
  { hanzi: "大自然", pinyin: "dàzìrán", english: "nature, the natural world" },
  { hanzi: "待", pinyin: "dāi", english: "to stay" },
  { hanzi: "戴", pinyin: "dài", english: "to wear, to put on" },
  { hanzi: "袋子", pinyin: "dàizi", english: "bag, sack" },
  { hanzi: "单位", pinyin: "dānwèi", english: "unit, department (one's workplace/employer)" },
  { hanzi: "当", pinyin: "dāng", english: "to serve as; at the time of" },
  { hanzi: "当时", pinyin: "dāngshí", english: "at that time, then" },
  { hanzi: "刀", pinyin: "dāo", english: "knife" },
  { hanzi: "导游", pinyin: "dǎoyóu", english: "tour guide" },
  { hanzi: "倒", pinyin: "dào", english: "to fall, to collapse" },
  { hanzi: "道", pinyin: "dào", english: "path, way, method" },
  { hanzi: "到底", pinyin: "dàodǐ", english: "finally, after all, to the end" },
  { hanzi: "到来", pinyin: "dàolái", english: "to arrive" },
  { hanzi: "道路", pinyin: "dàolù", english: "road, path" },
  { hanzi: "道歉", pinyin: "dàoqiàn", english: "to apologize" },
  { hanzi: "得意", pinyin: "déyì", english: "proud, complacent" },
  { hanzi: "登机", pinyin: "dēngjī", english: "to board a plane" },
  { hanzi: "等", pinyin: "děng", english: "and so on, etc." },
  { hanzi: "等到", pinyin: "děngdào", english: "until, by the time" },
  { hanzi: "低", pinyin: "dī", english: "low; to lower" },
  { hanzi: "低价", pinyin: "dījià", english: "low price" },
  { hanzi: "低温", pinyin: "dīwēn", english: "low temperature" },
  { hanzi: "低于", pinyin: "dīyú", english: "to be lower than" },
  { hanzi: "底", pinyin: "dǐ", english: "bottom, base" },
  { hanzi: "底下", pinyin: "dǐxia", english: "below, underneath" },
  { hanzi: "地球", pinyin: "dìqiú", english: "earth" },
  { hanzi: "地址", pinyin: "dìzhǐ", english: "address" },
  { hanzi: "点名", pinyin: "diǎnmíng", english: "to call the roll" },
  { hanzi: "点头", pinyin: "diǎntóu", english: "to nod" },
  { hanzi: "电动车", pinyin: "diàndòngchē", english: "electric vehicle, e-bike" },
  { hanzi: "电视剧", pinyin: "diànshìjù", english: "TV drama" },
  { hanzi: "掉", pinyin: "diào", english: "to fall, to drop" },
  { hanzi: "调查", pinyin: "diàochá", english: "to investigate" },
  { hanzi: "订", pinyin: "dìng", english: "to order, to book" },
  { hanzi: "定", pinyin: "dìng", english: "to fix, to set, to determine" },
  { hanzi: "东部", pinyin: "dōngbù", english: "eastern part" },
  { hanzi: "动车", pinyin: "dòngchē", english: "high-speed train" },
  { hanzi: "动作", pinyin: "dòngzuò", english: "movement, action" },
  { hanzi: "读者", pinyin: "dúzhě", english: "reader" },
  { hanzi: "堵车", pinyin: "dǔchē", english: "traffic jam" },
  { hanzi: "度假", pinyin: "dùjià", english: "to go on vacation" },
  { hanzi: "肚子", pinyin: "dùzi", english: "belly, stomach" },
  { hanzi: "短信", pinyin: "duǎnxìn", english: "text message" },
  { hanzi: "队", pinyin: "duì", english: "team, squad" },
  { hanzi: "对方", pinyin: "duìfāng", english: "the other party, counterpart" },
  { hanzi: "对面", pinyin: "duìmiàn", english: "opposite side" },
  { hanzi: "对于", pinyin: "duìyú", english: "regarding, concerning" },
  { hanzi: "队员", pinyin: "duìyuán", english: "team member" },
  { hanzi: "队长", pinyin: "duìzhǎng", english: "team leader" },
  { hanzi: "顿", pinyin: "dùn", english: "measure word for meals" },
  { hanzi: "多么", pinyin: "duōme", english: "how, so, what" },
  { hanzi: "多数", pinyin: "duōshù", english: "majority" },
  { hanzi: "多样", pinyin: "duōyàng", english: "diverse, varied" },
  { hanzi: "而", pinyin: "ér", english: "but, and, yet" },
  { hanzi: "儿童", pinyin: "értóng", english: "child" },
  { hanzi: "发出", pinyin: "fāchū", english: "to send out, to issue" },
  { hanzi: "发送", pinyin: "fāsòng", english: "to send" },
  { hanzi: "法", pinyin: "fǎ", english: "law" },
  { hanzi: "法律", pinyin: "fǎlǜ", english: "law" },
  { hanzi: "翻译", pinyin: "fānyì", english: "to translate; translation" },
  { hanzi: "烦", pinyin: "fán", english: "annoyed, vexed" },
  { hanzi: "烦恼", pinyin: "fánnǎo", english: "worried, distressed" },
  { hanzi: "反对", pinyin: "fǎnduì", english: "to oppose, to be against" },
  { hanzi: "方面", pinyin: "fāngmiàn", english: "aspect, side" },
  { hanzi: "方式", pinyin: "fāngshì", english: "way, method" },
  { hanzi: "房东", pinyin: "fángdōng", english: "landlord" },
  { hanzi: "房租", pinyin: "fángzū", english: "rent" },
  { hanzi: "放弃", pinyin: "fàngqì", english: "to give up" },
  { hanzi: "放松", pinyin: "fàngsōng", english: "to relax" },
  { hanzi: "费", pinyin: "fèi", english: "fee, expense" },
  { hanzi: "费用", pinyin: "fèiyong", english: "cost, expense" },
  { hanzi: "分数", pinyin: "fēnshù", english: "score, grade, fraction" },
  { hanzi: "分为", pinyin: "fēnwéi", english: "to be divided into" },
  { hanzi: "份", pinyin: "fèn", english: "measure word for copies, shares" },
  { hanzi: "丰富", pinyin: "fēngfù", english: "rich, abundant" },
  { hanzi: "风景", pinyin: "fēngjǐng", english: "scenery, landscape" },
  { hanzi: "否则", pinyin: "fǒuzé", english: "otherwise, if not" },
  { hanzi: "幅", pinyin: "fú", english: "measure word for paintings, photos" },
  { hanzi: "符合", pinyin: "fúhé", english: "to conform to, to match" },
  { hanzi: "付", pinyin: "fù", english: "to pay" },
  { hanzi: "父母", pinyin: "fùmǔ", english: "parents" },
  { hanzi: "父女", pinyin: "fùnǚ", english: "father and daughter" },
  { hanzi: "父亲", pinyin: "fùqīn", english: "father" },
  { hanzi: "复印", pinyin: "fùyìn", english: "to photocopy, to duplicate" },
  { hanzi: "复杂", pinyin: "fùzá", english: "complicated, complex" },
  { hanzi: "负责", pinyin: "fùzé", english: "to be responsible; responsible" },
  { hanzi: "负责人", pinyin: "fùzérén", english: "person in charge" },
  { hanzi: "父子", pinyin: "fùzǐ", english: "father and son" },
  { hanzi: "改", pinyin: "gǎi", english: "to change, to alter" },
  { hanzi: "改变", pinyin: "gǎibiàn", english: "to change" },
  { hanzi: "干", pinyin: "gān", english: "dry" },
  { hanzi: "干杯", pinyin: "gānbēi", english: "to toast, cheers" },
  { hanzi: "赶", pinyin: "gǎn", english: "to hurry, to catch up" },
  { hanzi: "敢", pinyin: "gǎn", english: "to dare" },
  { hanzi: "感动", pinyin: "gǎndòng", english: "moved, touched" },
  { hanzi: "赶紧", pinyin: "gǎnjǐn", english: "quickly, promptly" },
  { hanzi: "感觉", pinyin: "gǎnjué", english: "feeling, sense; to feel" },
  { hanzi: "赶快", pinyin: "gǎnkuài", english: "quickly, at once" },
  { hanzi: "感情", pinyin: "gǎnqíng", english: "emotion, feeling" },
  { hanzi: "感人", pinyin: "gǎnrén", english: "touching, moving" },
  { hanzi: "赶上", pinyin: "gǎnshàng", english: "to catch up, to keep up with" },
  { hanzi: "感受", pinyin: "gǎnshòu", english: "feeling, experience" },
  { hanzi: "感谢", pinyin: "gǎnxiè", english: "to thank" },
  { hanzi: "干活儿", pinyin: "gànhuór", english: "to work" },
  { hanzi: "钢琴", pinyin: "gāngqín", english: "piano" },
  { hanzi: "高价", pinyin: "gāojià", english: "high price" },
  { hanzi: "高考", pinyin: "gāokǎo", english: "Gaokao, college entrance exam" },
  { hanzi: "高速", pinyin: "gāosù", english: "high speed" },
  { hanzi: "高温", pinyin: "gāowēn", english: "high temperature" },
  { hanzi: "高于", pinyin: "gāoyú", english: "higher than, above" },
  { hanzi: "胳膊", pinyin: "gēbo", english: "arm" },
  { hanzi: "歌声", pinyin: "gēshēng", english: "sound of singing, song" },
  { hanzi: "歌手", pinyin: "gēshǒu", english: "singer" },
  { hanzi: "各", pinyin: "gè", english: "each, every" },
  { hanzi: "各地", pinyin: "gèdì", english: "various places" },
  { hanzi: "各个", pinyin: "gègè", english: "each, every; one by one" },
  { hanzi: "各位", pinyin: "gèwèi", english: "everyone, all (respectful)" },
  { hanzi: "各种", pinyin: "gèzhǒng", english: "various kinds, all kinds" },
  { hanzi: "更加", pinyin: "gèngjiā", english: "more, even more" },
  { hanzi: "工厂", pinyin: "gōngchǎng", english: "factory" },
  { hanzi: "功夫", pinyin: "gōngfu", english: "kung fu, skill, effort" },
  { hanzi: "公共", pinyin: "gōnggòng", english: "public, common" },
  { hanzi: "功课", pinyin: "gōngkè", english: "schoolwork, homework" },
  { hanzi: "公里", pinyin: "gōnglǐ", english: "kilometer" },
  { hanzi: "公路", pinyin: "gōnglù", english: "highway, road" },
  { hanzi: "工人", pinyin: "gōngrén", english: "worker" },
  { hanzi: "工资", pinyin: "gōngzī", english: "wage, salary" },
  { hanzi: "共", pinyin: "gòng", english: "together, in total" },
  { hanzi: "共同", pinyin: "gòngtóng", english: "common, joint" },
  { hanzi: "够", pinyin: "gòu", english: "enough" },
  { hanzi: "购买", pinyin: "gòumǎi", english: "to purchase" },
  { hanzi: "购物", pinyin: "gòuwù", english: "to shop" },
  { hanzi: "估计", pinyin: "gūjì", english: "to estimate, to guess" },
  { hanzi: "姑娘", pinyin: "gūniang", english: "girl" },
  { hanzi: "鼓励", pinyin: "gǔlì", english: "to encourage" },
  { hanzi: "顾客", pinyin: "gùkè", english: "customer" },
  { hanzi: "故意", pinyin: "gùyì", english: "deliberately, on purpose" },
  { hanzi: "挂", pinyin: "guà", english: "to hang, to suspend" },
  { hanzi: "关键", pinyin: "guānjiàn", english: "key, crucial; crux" },
  { hanzi: "观看", pinyin: "guānkàn", english: "to watch, to view" },
  { hanzi: "观众", pinyin: "guānzhòng", english: "audience" },
  { hanzi: "管", pinyin: "guǎn", english: "to manage, to control" },
  { hanzi: "管理", pinyin: "guǎnlǐ", english: "to manage" },
  { hanzi: "光", pinyin: "guāng", english: "light; only, merely" },
  { hanzi: "广播", pinyin: "guǎngbō", english: "to broadcast; radio broadcast" },
  { hanzi: "广告", pinyin: "guǎnggào", english: "advertisement" },
  { hanzi: "逛", pinyin: "guàng", english: "to stroll, to browse" },
  { hanzi: "规定", pinyin: "guīdìng", english: "to stipulate; regulation, rule" },
  { hanzi: "国籍", pinyin: "guójí", english: "nationality" },
  { hanzi: "国际", pinyin: "guójì", english: "international" },
  { hanzi: "果汁", pinyin: "guǒzhī", english: "fruit juice" },
  { hanzi: "过程", pinyin: "guòchéng", english: "process" },
  { hanzi: "海洋", pinyin: "hǎiyáng", english: "ocean, sea" },
  { hanzi: "害羞", pinyin: "hàixiū", english: "shy" },
  { hanzi: "寒假", pinyin: "hánjià", english: "winter vacation" },
  { hanzi: "寒冷", pinyin: "hánlěng", english: "cold, frigid, chilly" },
  { hanzi: "喊", pinyin: "hǎn", english: "to shout" },
  { hanzi: "汗", pinyin: "hàn", english: "sweat" },
  { hanzi: "航班", pinyin: "hángbān", english: "flight" },
  { hanzi: "好处", pinyin: "hǎochù", english: "benefit" },
  { hanzi: "好好", pinyin: "hǎohǎo", english: "well, thoroughly" },
  { hanzi: "好笑", pinyin: "hǎoxiào", english: "funny, ridiculous" },
  { hanzi: "合格", pinyin: "hégé", english: "qualified" },
  { hanzi: "盒子", pinyin: "hézi", english: "box" },
  { hanzi: "红包", pinyin: "hóngbāo", english: "red envelope, red packet" },
  { hanzi: "厚", pinyin: "hòu", english: "thick" },
  { hanzi: "后悔", pinyin: "hòuhuǐ", english: "to regret" },
  { hanzi: "忽然", pinyin: "hūrán", english: "suddenly" },
  { hanzi: "互联网", pinyin: "hùliánwǎng", english: "Internet" },
  { hanzi: "护士", pinyin: "hùshi", english: "nurse" },
  { hanzi: "互相", pinyin: "hùxiāng", english: "each other" },
  { hanzi: "话剧", pinyin: "huàjù", english: "drama" },
  { hanzi: "怀疑", pinyin: "huáiyí", english: "to doubt" },
  { hanzi: "坏处", pinyin: "huàichù", english: "disadvantage, harm" },
  { hanzi: "环保", pinyin: "huánbǎo", english: "environmental protection; green" },
  { hanzi: "换乘", pinyin: "huànchéng", english: "to transfer, to change" },
  { hanzi: "回复", pinyin: "huífù", english: "to reply" },
  { hanzi: "回信", pinyin: "huíxìn", english: "to reply to a letter; reply" },
  { hanzi: "回忆", pinyin: "huíyì", english: "memory, to recall" },
  { hanzi: "会员", pinyin: "huìyuán", english: "membership" },
  { hanzi: "活", pinyin: "huó", english: "alive, living; work, job" },
  { hanzi: "活动", pinyin: "huódòng", english: "activity, event; to move" },
  { hanzi: "活泼", pinyin: "huópō", english: "lively" },
  { hanzi: "火", pinyin: "huǒ", english: "fire; popular, hot" },
  { hanzi: "货", pinyin: "huò", english: "goods, commodity" },
  { hanzi: "获得", pinyin: "huòdé", english: "to get, to obtain" },
  { hanzi: "获奖", pinyin: "huòjiǎng", english: "to win a prize" },
  { hanzi: "获取", pinyin: "huòqǔ", english: "to gain, to obtain (formal, e.g. information/data)" },
  { hanzi: "基本", pinyin: "jīběn", english: "basic, fundamental; basically" },
  { hanzi: "基本上", pinyin: "jīběnshàng", english: "basically" },
  { hanzi: "基础", pinyin: "jīchǔ", english: "basics, foundation" },
  { hanzi: "激动", pinyin: "jīdòng", english: "excited; to excite" },
  { hanzi: "积极", pinyin: "jījí", english: "positive, enthusiastic" },
  { hanzi: "积累", pinyin: "jīlěi", english: "to accumulate, to build up" },
  { hanzi: "及时", pinyin: "jíshí", english: "timely, prompt; promptly" },
  { hanzi: "即使", pinyin: "jíshǐ", english: "even if" },
  { hanzi: "既", pinyin: "jì", english: "already; both…and…" },
  { hanzi: "寄", pinyin: "jì", english: "to send" },
  { hanzi: "计划", pinyin: "jìhuà", english: "plan; to plan" },
  { hanzi: "既然", pinyin: "jìrán", english: "since" },
  { hanzi: "技术", pinyin: "jìshù", english: "technology" },
  { hanzi: "继续", pinyin: "jìxù", english: "to continue" },
  { hanzi: "记者", pinyin: "jìzhě", english: "reporter" },
  { hanzi: "加班", pinyin: "jiābān", english: "to work overtime" },
  { hanzi: "家具", pinyin: "jiājù", english: "furniture" },
  { hanzi: "加快", pinyin: "jiākuài", english: "to speed up, to accelerate" },
  { hanzi: "加强", pinyin: "jiāqiáng", english: "to strengthen, to reinforce" },
  { hanzi: "加入", pinyin: "jiārù", english: "to join, to add" },
  { hanzi: "加上", pinyin: "jiāshàng", english: "plus, with the addition of" },
  { hanzi: "家庭", pinyin: "jiātíng", english: "family" },
  { hanzi: "家乡", pinyin: "jiāxiāng", english: "hometown" },
  { hanzi: "加油", pinyin: "jiāyóu", english: "to refuel; to cheer on" },
  { hanzi: "加油站", pinyin: "jiāyóuzhàn", english: "gas station" },
  { hanzi: "家长", pinyin: "jiāzhǎng", english: "parent, head of family" },
  { hanzi: "假", pinyin: "jiǎ", english: "false, fake" },
  { hanzi: "价格", pinyin: "jiàgé", english: "price (the set/listed price)" },
  { hanzi: "价钱", pinyin: "jiàqián", english: "price (colloquial, negotiable)" },
  { hanzi: "假日", pinyin: "jiàrì", english: "holiday, day off, vacation" },
  { hanzi: "减", pinyin: "jiǎn", english: "to reduce, to decrease" },
  { hanzi: "减轻", pinyin: "jiǎnqīng", english: "to lighten, to ease, to alleviate" },
  { hanzi: "减少", pinyin: "jiǎnshǎo", english: "to reduce, to decrease, to cut down" },
  { hanzi: "健身", pinyin: "jiànshēn", english: "to exercise, to work out" },
  { hanzi: "健身房", pinyin: "jiànshēnfáng", english: "gym" },
  { hanzi: "建议", pinyin: "jiànyì", english: "to suggest; suggestion" },
  { hanzi: "江", pinyin: "jiāng", english: "river" },
  { hanzi: "将", pinyin: "jiāng", english: "will, be about to" },
  { hanzi: "将来", pinyin: "jiānglái", english: "future" },
  { hanzi: "将要", pinyin: "jiāngyào", english: "will, be going to, be about to" },
  { hanzi: "奖", pinyin: "jiǎng", english: "prize, award" },
  { hanzi: "奖金", pinyin: "jiǎngjīn", english: "bonus, prize money" },
  { hanzi: "奖学金", pinyin: "jiǎngxuéjīn", english: "scholarship" },
  { hanzi: "降", pinyin: "jiàng", english: "to fall, to drop, to descend" },
  { hanzi: "降低", pinyin: "jiàngdī", english: "to reduce, to lower" },
  { hanzi: "降价", pinyin: "jiàngjià", english: "to reduce price, to lower price" },
  { hanzi: "降落", pinyin: "jiàngluò", english: "to land, to touch down" },
  { hanzi: "降温", pinyin: "jiàngwēn", english: "to cool down" },
  { hanzi: "交", pinyin: "jiāo", english: "to hand in; to make friends" },
  { hanzi: "骄傲", pinyin: "jiāo\'ào", english: "proud, arrogant; pride" },
  { hanzi: "交警", pinyin: "jiāojǐng", english: "traffic police" },
  { hanzi: "交流", pinyin: "jiāoliú", english: "to communicate" },
  { hanzi: "郊区", pinyin: "jiāoqū", english: "suburb" },
  { hanzi: "交通", pinyin: "jiāotōng", english: "traffic" },
  { hanzi: "教练", pinyin: "jiàoliàn", english: "coach" },
  { hanzi: "教师", pinyin: "jiàoshī", english: "teacher" },
  { hanzi: "教授", pinyin: "jiàoshòu", english: "professor" },
  { hanzi: "教学", pinyin: "jiàoxué", english: "teaching" },
  { hanzi: "教育", pinyin: "jiàoyù", english: "education; to educate" },
  { hanzi: "叫作", pinyin: "jiàozuò", english: "to be called, to be known as" },
  { hanzi: "街道", pinyin: "jiēdào", english: "street" },
  { hanzi: "接受", pinyin: "jiēshòu", english: "to accept" },
  { hanzi: "接着", pinyin: "jiēzhe", english: "then, next; to continue" },
  { hanzi: "结果", pinyin: "jiéguǒ", english: "result, outcome; as a result" },
  { hanzi: "节假日", pinyin: "jiéjiàrì", english: "festivals and holidays" },
  { hanzi: "节约", pinyin: "jiéyuē", english: "to save, to economize" },
  { hanzi: "结账", pinyin: "jiézhàng", english: "to pay the bill, to check out" },
  { hanzi: "解释", pinyin: "jiěshì", english: "to explain, to interpret" },
  { hanzi: "今后", pinyin: "jīnhòu", english: "from now on, in the future" },
  { hanzi: "仅", pinyin: "jǐn", english: "only, merely, solely" },
  { hanzi: "尽管", pinyin: "jǐnguǎn", english: "although, even though; feel free to" },
  { hanzi: "仅仅", pinyin: "jǐnjǐn", english: "only, merely, barely" },
  { hanzi: "紧张", pinyin: "jǐnzhāng", english: "nervous, tense" },
  { hanzi: "进入", pinyin: "jìnrù", english: "to enter, to access" },
  { hanzi: "进行", pinyin: "jìnxíng", english: "to carry out, to conduct" },
  { hanzi: "禁止", pinyin: "jìnzhǐ", english: "to prohibit, to forbid, to ban" },
  { hanzi: "精彩", pinyin: "jīngcǎi", english: "brilliant, splendid, wonderful" },
  { hanzi: "经济", pinyin: "jīngjì", english: "economy; economical" },
  { hanzi: "京剧", pinyin: "jīngjù", english: "Beijing opera" },
  { hanzi: "经历", pinyin: "jīnglì", english: "to experience; experience (an event one lived through)" },
  { hanzi: "经验", pinyin: "jīngyàn", english: "experience (skill/knowledge gained over time)" },
  { hanzi: "警察", pinyin: "jǐngchá", english: "police" },
  { hanzi: "景点", pinyin: "jǐngdiǎn", english: "scenic spot, tourist attraction" },
  { hanzi: "景区", pinyin: "jǐngqū", english: "scenic area, tourist zone" },
  { hanzi: "景色", pinyin: "jǐngsè", english: "scenery" },
  { hanzi: "竟然", pinyin: "jìngrán", english: "unexpectedly" },
  { hanzi: "竞争", pinyin: "jìngzhēng", english: "to compete" },
  { hanzi: "镜子", pinyin: "jìngzi", english: "mirror" },
  { hanzi: "究竟", pinyin: "jiūjìng", english: "actually, exactly, after all" },
  { hanzi: "就是", pinyin: "jiùshì", english: "precisely; even if" },
  { hanzi: "举", pinyin: "jǔ", english: "to raise, to lift; to hold an event" },
  { hanzi: "举办", pinyin: "jǔbàn", english: "to hold, to host, to organize" },
  { hanzi: "举例", pinyin: "jǔlì", english: "to give an example" },
  { hanzi: "举行", pinyin: "jǔxíng", english: "to hold, to convene" },
  { hanzi: "聚", pinyin: "jù", english: "to gather, to get together" },
  { hanzi: "聚餐", pinyin: "jùcān", english: "to have a dinner together" },
  { hanzi: "聚会", pinyin: "jùhuì", english: "to get together; party, gathering" },
  { hanzi: "拒绝", pinyin: "jùjué", english: "to refuse, to reject, to decline" },
  { hanzi: "距离", pinyin: "jùlí", english: "distance; to be away from" },
  { hanzi: "剧院", pinyin: "jùyuàn", english: "theater, opera house" },
  { hanzi: "开玩笑", pinyin: "kāi wánxiào", english: "to make fun of, to joke" },
  { hanzi: "看法", pinyin: "kànfǎ", english: "view, opinion" },
  { hanzi: "烤", pinyin: "kǎo", english: "to bake, to roast, to grill" },
  { hanzi: "考虑", pinyin: "kǎolǜ", english: "to consider, to think over" },
  { hanzi: "考生", pinyin: "kǎoshēng", english: "examinee" },
  { hanzi: "棵", pinyin: "kē", english: "measure word for trees, plants" },
  { hanzi: "科技", pinyin: "kējì", english: "science and technology" },
  { hanzi: "科学", pinyin: "kēxué", english: "science; scientific" },
  { hanzi: "咳", pinyin: "ké", english: "to cough" },
  { hanzi: "咳嗽", pinyin: "késou", english: "to cough" },
  { hanzi: "可惜", pinyin: "kěxī", english: "regrettable, unfortunate, a pity" },
  { hanzi: "克", pinyin: "kè", english: "gram" },
  { hanzi: "课程", pinyin: "kèchéng", english: "curriculum" },
  { hanzi: "客气", pinyin: "kèqi", english: "polite, courteous" },
  { hanzi: "课堂", pinyin: "kètáng", english: "classroom" },
  { hanzi: "客厅", pinyin: "kètīng", english: "living room, parlor" },
  { hanzi: "肯定", pinyin: "kěndìng", english: "to be certain; surely, certainly" },
  { hanzi: "空", pinyin: "kōng", english: "empty, vacant" },
  { hanzi: "空气", pinyin: "kōngqì", english: "air, atmosphere" },
  { hanzi: "恐怕", pinyin: "kǒngpà", english: "I\'m afraid, perhaps, maybe" },
  { hanzi: "空", pinyin: "kòng", english: "free time, empty space" },
  { hanzi: "口语", pinyin: "kǒuyǔ", english: "spoken language" },
  { hanzi: "苦", pinyin: "kǔ", english: "bitter" },
  { hanzi: "快餐", pinyin: "kuàicān", english: "fast food" },
  { hanzi: "快递", pinyin: "kuàidì", english: "express delivery" },
  { hanzi: "快速", pinyin: "kuàisù", english: "fast, high-speed" },
  { hanzi: "困", pinyin: "kùn", english: "sleepy, tired" },
  { hanzi: "困难", pinyin: "kùnnan", english: "difficult; difficulty, trouble" },
  { hanzi: "拉", pinyin: "lā", english: "to pull, to drag, to draw" },
  { hanzi: "垃圾", pinyin: "lājī", english: "garbage, trash, rubbish" },
  { hanzi: "辣", pinyin: "là", english: "hot, spicy" },
  { hanzi: "来不及", pinyin: "láibují", english: "there\'s not enough time" },
  { hanzi: "来得及", pinyin: "láidejí", english: "there\'s still time, can make it" },
  { hanzi: "懒", pinyin: "lǎn", english: "lazy, idle" },
  { hanzi: "浪费", pinyin: "làngfèi", english: "to waste, to squander" },
  { hanzi: "浪漫", pinyin: "làngmàn", english: "romantic" },
  { hanzi: "老虎", pinyin: "lǎohǔ", english: "tiger" },
  { hanzi: "老家", pinyin: "lǎojiā", english: "hometown, home state" },
  { hanzi: "老年", pinyin: "lǎonián", english: "elderly" },
  { hanzi: "老是", pinyin: "lǎoshì", english: "always, constantly" },
  { hanzi: "冷静", pinyin: "lěngjìng", english: "calm, cool-headed" },
  { hanzi: "理发", pinyin: "lǐfà", english: "to have a haircut, to cut hair" },
  { hanzi: "理解", pinyin: "lǐjiě", english: "to understand, to comprehend" },
  { hanzi: "礼貌", pinyin: "lǐmào", english: "courtesy, politeness; polite" },
  { hanzi: "理想", pinyin: "lǐxiǎng", english: "ideal, dream" },
  { hanzi: "厉害", pinyin: "lìhai", english: "impressive, excellent, severe" },
  { hanzi: "力气", pinyin: "lìqi", english: "strength, physical power" },
  { hanzi: "例如", pinyin: "lìrú", english: "for example, such as" },
  { hanzi: "例子", pinyin: "lìzi", english: "example, instance" },
  { hanzi: "俩", pinyin: "liǎ", english: "two, both" },
  { hanzi: "连", pinyin: "lián", english: "even, including; to connect" },
  { hanzi: "联系", pinyin: "liánxì", english: "to contact, to connect" },
  { hanzi: "凉", pinyin: "liáng", english: "cool, cold" },
  { hanzi: "量", pinyin: "liáng", english: "to measure, to weigh" },
  { hanzi: "两", pinyin: "liǎng", english: "measure word for vehicles, animals" },
  { hanzi: "亮", pinyin: "liàng", english: "bright, light; to shine" },
  { hanzi: "列", pinyin: "liè", english: "to arrange in a row, to list" },
  { hanzi: "零下", pinyin: "líng xià", english: "below zero" },
  { hanzi: "零花钱", pinyin: "línghuāqián", english: "pocket money, spending money" },
  { hanzi: "零钱", pinyin: "língqián", english: "change, small denominations" },
  { hanzi: "零食", pinyin: "língshí", english: "snacks" },
  { hanzi: "另", pinyin: "lìng", english: "other, another" },
  { hanzi: "另外", pinyin: "lìngwài", english: "in addition, moreover; other" },
  { hanzi: "留", pinyin: "liú", english: "to stay, to remain, to keep" },
  { hanzi: "流", pinyin: "liú", english: "to flow, to circulate" },
  { hanzi: "流利", pinyin: "liúlì", english: "fluent, smooth" },
  { hanzi: "留下", pinyin: "liúxia", english: "to leave behind, to remain" },
  { hanzi: "流行", pinyin: "liúxíng", english: "to be popular, to be in fashion" },
  { hanzi: "路过", pinyin: "lùguò", english: "to pass by, to go by" },
  { hanzi: "旅馆", pinyin: "lǚguǎn", english: "hotel, inn" },
  { hanzi: "旅客", pinyin: "lǚkè", english: "traveler, passenger" },
  { hanzi: "旅行", pinyin: "lǚxíng", english: "to travel" },
  { hanzi: "律师", pinyin: "lǜshī", english: "lawyer, attorney" },
  { hanzi: "乱", pinyin: "luàn", english: "messy, disorderly; arbitrarily" },
  { hanzi: "落", pinyin: "luò", english: "to fall, to drop, to land" },
  { hanzi: "麻烦", pinyin: "máfan", english: "troublesome; trouble, inconvenience" },
  { hanzi: "馒头", pinyin: "mántou", english: "steamed bun, mantou" },
  { hanzi: "满", pinyin: "mǎn", english: "full, filled" },
  { hanzi: "毛巾", pinyin: "máojīn", english: "towel" },
  { hanzi: "毛衣", pinyin: "máoyī", english: "sweater, woolen garment" },
  { hanzi: "帽子", pinyin: "màozi", english: "hat, cap" },
  { hanzi: "美", pinyin: "měi", english: "beautiful, pretty" },
  { hanzi: "美好", pinyin: "měihǎo", english: "beautiful, splendid" },
  { hanzi: "美景", pinyin: "měijǐng", english: "beautiful scenery" },
  { hanzi: "美丽", pinyin: "měilì", english: "beautiful, lovely" },
  { hanzi: "美食", pinyin: "měishí", english: "delicious food, cuisine" },
  { hanzi: "梦", pinyin: "mèng", english: "dream; to dream" },
  { hanzi: "梦想", pinyin: "mèngxiǎng", english: "dream; to dream" },
  { hanzi: "密码", pinyin: "mìmǎ", english: "password, PIN code" },
  { hanzi: "免费", pinyin: "miǎnfèi", english: "free of charge" },
  { hanzi: "面对", pinyin: "miànduì", english: "to face, to confront" },
  { hanzi: "面试", pinyin: "miànshì", english: "interview; to interview" },
  { hanzi: "秒", pinyin: "miǎo", english: "second (time unit)" },
  { hanzi: "民族", pinyin: "mínzú", english: "ethnic group, nationality" },
  { hanzi: "末", pinyin: "mò", english: "end, last" },
  { hanzi: "母女", pinyin: "mǔnǚ", english: "mother and daughter" },
  { hanzi: "母亲", pinyin: "mǔqīn", english: "mother" },
  { hanzi: "母子", pinyin: "mǔzǐ", english: "mother and son" },
  { hanzi: "目标", pinyin: "mùbiāo", english: "goal, target, objective" },
  { hanzi: "目的", pinyin: "mùdì", english: "purpose, aim, goal" },
  { hanzi: "目的地", pinyin: "mùdìdì", english: "destination" },
  { hanzi: "目前", pinyin: "mùqián", english: "currently, at present" },
  { hanzi: "耐心", pinyin: "nàixīn", english: "patient; patience" },
  { hanzi: "南部", pinyin: "nánbù", english: "southern part, south" },
  { hanzi: "难道", pinyin: "nándào", english: "could it be that…?" },
  { hanzi: "男士", pinyin: "nánshì", english: "man, gentleman" },
  { hanzi: "难受", pinyin: "nánshòu", english: "uncomfortable, painful" },
  { hanzi: "难忘", pinyin: "nánwàng", english: "unforgettable" },
  { hanzi: "男性", pinyin: "nánxìng", english: "male, masculine" },
  { hanzi: "内", pinyin: "nèi", english: "inside, within" },
  { hanzi: "内容", pinyin: "nèiróng", english: "content, substance" },
  { hanzi: "内心", pinyin: "nèixīn", english: "heart, inner self" },
  { hanzi: "能否", pinyin: "néng fǒu", english: "whether or not, can or cannot" },
  { hanzi: "能够", pinyin: "nénggòu", english: "can, be able to" },
  { hanzi: "能力", pinyin: "nénglì", english: "ability, capability, capacity" },
  { hanzi: "嗯", pinyin: "ǹg", english: "uh-huh, hmm" },
  { hanzi: "年底", pinyin: "niándǐ", english: "end of the year" },
  { hanzi: "年龄", pinyin: "niánlíng", english: "age" },
  { hanzi: "农村", pinyin: "nóngcūn", english: "rural area, countryside" },
  { hanzi: "弄", pinyin: "nòng", english: "to do, to handle, to mess with" },
  { hanzi: "女性", pinyin: "nǚxìng", english: "female, feminine" },
  { hanzi: "暖和", pinyin: "nuǎnhuo", english: "warm; to warm up" },
  { hanzi: "偶尔", pinyin: "ǒu\'ěr", english: "occasionally, sometimes" },
  { hanzi: "拍", pinyin: "pāi", english: "to pat, to clap, to take a photo" },
  { hanzi: "排", pinyin: "pái", english: "to line up; row, line" },
  { hanzi: "牌", pinyin: "pái", english: "card, brand, plaque, sign" },
  { hanzi: "排队", pinyin: "páiduì", english: "to line up, to queue up" },
  { hanzi: "排球", pinyin: "páiqiú", english: "volleyball" },
  { hanzi: "牌子", pinyin: "páizi", english: "brand, sign, label" },
  { hanzi: "判断", pinyin: "pànduàn", english: "to judge, to determine" },
  { hanzi: "陪", pinyin: "péi", english: "to accompany, to keep company" },
  { hanzi: "批评", pinyin: "pīpíng", english: "to criticize" },
  { hanzi: "皮肤", pinyin: "pífū", english: "skin" },
  { hanzi: "脾气", pinyin: "píqi", english: "temperament, temper" },
  { hanzi: "皮鞋", pinyin: "píxié", english: "leather shoes" },
  { hanzi: "篇", pinyin: "piān", english: "measure word for essays, articles" },
  { hanzi: "片", pinyin: "piàn", english: "piece, slice; measure word for flat objects" },
  { hanzi: "乒乓球", pinyin: "pīngpāngqiú", english: "table tennis, ping-pong" },
  { hanzi: "平常", pinyin: "píngcháng", english: "ordinary, usual; usually" },
  { hanzi: "破", pinyin: "pò", english: "broken, damaged; to break" },
  { hanzi: "葡萄", pinyin: "pútao", english: "grape" },
  { hanzi: "葡萄酒", pinyin: "pútaojiǔ", english: "wine, grape wine" },
  { hanzi: "普遍", pinyin: "pǔbiàn", english: "widespread, universal, common" },
  { hanzi: "普通", pinyin: "pǔtōng", english: "ordinary, common" },
  { hanzi: "普通话", pinyin: "pǔtōnghuà", english: "Mandarin Chinese, standard Chinese" },
  { hanzi: "期", pinyin: "qī", english: "period, phase; measure word for issues" },
  { hanzi: "期末", pinyin: "qīmò", english: "end of term, end of semester" },
  { hanzi: "期中", pinyin: "qīzhōng", english: "midterm, middle of the term" },
  { hanzi: "其次", pinyin: "qícì", english: "next, secondly, then" },
  { hanzi: "其中", pinyin: "qízhōng", english: "among them, inside" },
  { hanzi: "起到", pinyin: "qǐdào", english: "to play the role of, to function as" },
  { hanzi: "气", pinyin: "qì", english: "air, gas, breath; to anger" },
  { hanzi: "气候", pinyin: "qìhòu", english: "climate" },
  { hanzi: "汽水", pinyin: "qìshuǐ", english: "soda, soft drink" },
  { hanzi: "气温", pinyin: "qìwēn", english: "air temperature" },
  { hanzi: "千克", pinyin: "qiānkè", english: "kilogram" },
  { hanzi: "千万", pinyin: "qiānwàn", english: "by all means, absolutely" },
  { hanzi: "签证", pinyin: "qiānzhèng", english: "visa" },
  { hanzi: "前方", pinyin: "qiánfāng", english: "ahead, front" },
  { hanzi: "前后", pinyin: "qiánhòu", english: "front and back, around, about" },
  { hanzi: "强", pinyin: "qiáng", english: "strong, powerful" },
  { hanzi: "敲", pinyin: "qiāo", english: "to knock, to tap, to strike" },
  { hanzi: "桥", pinyin: "qiáo", english: "bridge" },
  { hanzi: "巧", pinyin: "qiǎo", english: "skillful, clever, opportune" },
  { hanzi: "巧克力", pinyin: "qiǎokèlì", english: "chocolate" },
  { hanzi: "亲戚", pinyin: "qīnqi", english: "relative, family member" },
  { hanzi: "琴", pinyin: "qín", english: "musical instrument" },
  { hanzi: "轻", pinyin: "qīng", english: "light, not heavy, gentle" },
  { hanzi: "青年", pinyin: "qīngnián", english: "youth, young people" },
  { hanzi: "轻松", pinyin: "qīngsōng", english: "relaxed, light, easy" },
  { hanzi: "情况", pinyin: "qíngkuàng", english: "situation, circumstance" },
  { hanzi: "庆祝", pinyin: "qìngzhù", english: "to celebrate" },
  { hanzi: "球队", pinyin: "qiúduì", english: "sports team, ball team" },
  { hanzi: "球迷", pinyin: "qiúmí", english: "fan, sports enthusiast" },
  { hanzi: "区", pinyin: "qū", english: "district, area, region" },
  { hanzi: "区别", pinyin: "qūbié", english: "difference; to distinguish" },
  { hanzi: "取", pinyin: "qǔ", english: "to take, to get, to obtain" },
  { hanzi: "取得", pinyin: "qǔdé", english: "to obtain, to gain (achievements/results)" },
  { hanzi: "取消", pinyin: "qǔxiāo", english: "to cancel, to call off" },
  { hanzi: "全", pinyin: "quán", english: "whole, entire; completely" },
  { hanzi: "全部", pinyin: "quánbù", english: "all, the whole thing" },
  { hanzi: "全都", pinyin: "quándōu", english: "all, entirely" },
  { hanzi: "全球", pinyin: "quánqiú", english: "the whole world, global" },
  { hanzi: "全身", pinyin: "quánshēn", english: "whole body" },
  { hanzi: "缺", pinyin: "quē", english: "to lack, to be short of" },
  { hanzi: "缺点", pinyin: "quēdiǎn", english: "shortcoming, defect" },
  { hanzi: "缺少", pinyin: "quēshǎo", english: "to lack, to be short of" },
  { hanzi: "却", pinyin: "què", english: "but, yet, however" },
  { hanzi: "确实", pinyin: "quèshí", english: "indeed, really" },
  { hanzi: "然而", pinyin: "rán\'ér", english: "however, but (formal/written)" },
  { hanzi: "热闹", pinyin: "rènao", english: "lively, bustling" },
  { hanzi: "人生", pinyin: "rénshēng", english: "life (one's life journey)" },
  { hanzi: "人数", pinyin: "rénshù", english: "number of people" },
  { hanzi: "人员", pinyin: "rényuán", english: "personnel, staff" },
  { hanzi: "任何", pinyin: "rènhé", english: "any, whatever" },
  { hanzi: "任务", pinyin: "rènwu", english: "task, assignment, mission" },
  { hanzi: "扔", pinyin: "rēng", english: "to throw, to toss" },
  { hanzi: "仍", pinyin: "réng", english: "still, yet" },
  { hanzi: "仍然", pinyin: "réngrán", english: "still, yet" },
  { hanzi: "日常", pinyin: "rìcháng", english: "daily, everyday" },
  { hanzi: "日记", pinyin: "rìjì", english: "diary" },
  { hanzi: "日期", pinyin: "rìqī", english: "date" },
  { hanzi: "日子", pinyin: "rìzi", english: "day, life, time" },
  { hanzi: "入", pinyin: "rù", english: "to enter, to go in" },
  { hanzi: "入口", pinyin: "rùkǒu", english: "entrance" },
  { hanzi: "入学", pinyin: "rùxué", english: "to enter school, to enroll" },
  { hanzi: "入住", pinyin: "rùzhù", english: "to check in, to move in" },
  { hanzi: "散步", pinyin: "sànbù", english: "to take a walk, to stroll" },
  { hanzi: "扫码", pinyin: "sǎomǎ", english: "to scan a code" },
  { hanzi: "森林", pinyin: "sēnlín", english: "forest" },
  { hanzi: "商量", pinyin: "shāngliang", english: "to discuss, to consult" },
  { hanzi: "商品", pinyin: "shāngpǐn", english: "product, commodity" },
  { hanzi: "伤心", pinyin: "shāngxīn", english: "sad, heartbroken" },
  { hanzi: "上门", pinyin: "shàngmén", english: "to visit, to go to someone\'s house" },
  { hanzi: "稍", pinyin: "shāo", english: "a little, slightly" },
  { hanzi: "稍微", pinyin: "shāowēi", english: "a little, slightly" },
  { hanzi: "少见", pinyin: "shǎojiàn", english: "rare, seldom seen" },
  { hanzi: "少量", pinyin: "shǎoliàng", english: "small amount, a little" },
  { hanzi: "少数", pinyin: "shǎoshù", english: "minority, small number" },
  { hanzi: "少年", pinyin: "shàonián", english: "juvenile, teenager, youth" },
  { hanzi: "社会", pinyin: "shèhuì", english: "society, community" },
  { hanzi: "摄氏度", pinyin: "shèshìdù", english: "degrees Celsius" },
  { hanzi: "身", pinyin: "shēn", english: "body, oneself" },
  { hanzi: "深", pinyin: "shēn", english: "deep, profound" },
  { hanzi: "身份证", pinyin: "shēnfènzhèng", english: "ID card, identification card" },
  { hanzi: "申请", pinyin: "shēnqǐng", english: "to apply, to file an application" },
  { hanzi: "甚至", pinyin: "shènzhì", english: "even, so much as that" },
  { hanzi: "生", pinyin: "shēng", english: "to give birth, to produce, to grow" },
  { hanzi: "生命", pinyin: "shēngmìng", english: "life (biological, being alive)" },
  { hanzi: "生意", pinyin: "shēngyi", english: "business, trade" },
  { hanzi: "省", pinyin: "shěng", english: "province" },
  { hanzi: "剩", pinyin: "shèng", english: "to be left over, to remain" },
  { hanzi: "失败", pinyin: "shībài", english: "to fail; failed, unsuccessful" },
  { hanzi: "师傅", pinyin: "shīfu", english: "master, skilled worker" },
  { hanzi: "失去", pinyin: "shīqù", english: "to lose, to be lost" },
  { hanzi: "师生", pinyin: "shīshēng", english: "teacher and student" },
  { hanzi: "失望", pinyin: "shīwàng", english: "to be disappointed; disappointed" },
  { hanzi: "十分", pinyin: "shífēn", english: "very, extremely, fully" },
  { hanzi: "实际", pinyin: "shíjì", english: "reality; actual, practical" },
  { hanzi: "时间表", pinyin: "shíjiānbiǎo", english: "schedule, timetable" },
  { hanzi: "实际上", pinyin: "shíjìshàng", english: "actually, in fact" },
  { hanzi: "食品", pinyin: "shípǐn", english: "food, provisions" },
  { hanzi: "食堂", pinyin: "shítáng", english: "cafeteria, dining hall" },
  { hanzi: "食物", pinyin: "shíwù", english: "food" },
  { hanzi: "实在", pinyin: "shízài", english: "honest, reliable; really, indeed" },
  { hanzi: "十字路口", pinyin: "shízì lùkǒu", english: "intersection, crossroads" },
  { hanzi: "使", pinyin: "shǐ", english: "to make, to cause, to use" },
  { hanzi: "使馆", pinyin: "shǐguǎn", english: "embassy" },
  { hanzi: "使用", pinyin: "shǐyòng", english: "to use, to employ" },
  { hanzi: "市场", pinyin: "shìchǎng", english: "market, marketplace" },
  { hanzi: "是否", pinyin: "shìfǒu", english: "whether or not, if" },
  { hanzi: "适合", pinyin: "shìhé", english: "to suit, to fit, to be suitable" },
  { hanzi: "世纪", pinyin: "shìjì", english: "century" },
  { hanzi: "视频", pinyin: "shìpín", english: "video, video clip" },
  { hanzi: "市区", pinyin: "shìqū", english: "urban area, city center" },
  { hanzi: "试题", pinyin: "shìtí", english: "test questions, exam paper" },
  { hanzi: "适应", pinyin: "shìyìng", english: "to adapt, to fit, to suit" },
  { hanzi: "收费", pinyin: "shōufèi", english: "to charge a fee" },
  { hanzi: "收入", pinyin: "shōurù", english: "income, revenue; to receive" },
  { hanzi: "收拾", pinyin: "shōushi", english: "to tidy up, to put in order" },
  { hanzi: "收听", pinyin: "shōutīng", english: "to listen in, to tune in" },
  { hanzi: "首", pinyin: "shǒu", english: "measure word for songs, poems" },
  { hanzi: "首都", pinyin: "shǒudū", english: "capital" },
  { hanzi: "首先", pinyin: "shǒuxiān", english: "first, firstly; first of all" },
  { hanzi: "受不了", pinyin: "shòubuliǎo", english: "to be unable to bear" },
  { hanzi: "售票员", pinyin: "shòupiàoyuán", english: "ticket seller, conductor" },
  { hanzi: "受伤", pinyin: "shòushāng", english: "to be injured, to get hurt" },
  { hanzi: "输", pinyin: "shū", english: "to lose, to be defeated" },
  { hanzi: "熟", pinyin: "shú", english: "ripe, cooked, mature" },
  { hanzi: "熟悉", pinyin: "shúxi", english: "to be familiar with, to know well" },
  { hanzi: "暑假", pinyin: "shǔjià", english: "summer vacation" },
  { hanzi: "数", pinyin: "shù", english: "number, figure; several, a few" },
  { hanzi: "数量", pinyin: "shùliàng", english: "quantity, amount" },
  { hanzi: "树林", pinyin: "shùlín", english: "woods, forest" },
  { hanzi: "数字", pinyin: "shùzì", english: "digit, figure, number" },
  { hanzi: "帅", pinyin: "shuài", english: "handsome, good-looking" },
  { hanzi: "顺便", pinyin: "shùnbiàn", english: "conveniently, in passing" },
  { hanzi: "顺利", pinyin: "shùnlì", english: "smooth, successful, going well" },
  { hanzi: "顺序", pinyin: "shùnxù", english: "order, sequence" },
  { hanzi: "说法", pinyin: "shuōfǎ", english: "way of saying something, statement" },
  { hanzi: "说明", pinyin: "shuōmíng", english: "to explain; explanation, instructions" },
  { hanzi: "说明书", pinyin: "shuōmíngshū", english: "instruction manual, user guide" },
  { hanzi: "硕士", pinyin: "shuòshì", english: "master (degree)" },
  { hanzi: "死", pinyin: "sǐ", english: "to die; dead; extremely" },
  { hanzi: "速度", pinyin: "sùdù", english: "speed" },
  { hanzi: "塑料", pinyin: "sùliào", english: "plastic" },
  { hanzi: "酸", pinyin: "suān", english: "sour, tart" },
  { hanzi: "酸奶", pinyin: "suānnǎi", english: "yogurt" },
  { hanzi: "算", pinyin: "suàn", english: "to calculate, to count; considered" },
  { hanzi: "随便", pinyin: "suíbiàn", english: "casual; to do as one pleases" },
  { hanzi: "随着", pinyin: "suízhe", english: "along with, following" },
  { hanzi: "孙女", pinyin: "sūnnǚ", english: "granddaughter" },
  { hanzi: "孙子", pinyin: "sūnzi", english: "grandson" },
  { hanzi: "所有", pinyin: "suǒyǒu", english: "all, every; possessions" },
  { hanzi: "台", pinyin: "tái", english: "measure word for machines, vehicles" },
  { hanzi: "抬", pinyin: "tái", english: "to lift, to raise" },
  { hanzi: "抬头", pinyin: "táitóu", english: "to raise one\'s head, to look up" },
  { hanzi: "态度", pinyin: "tàidù", english: "attitude, manner" },
  { hanzi: "弹", pinyin: "tán", english: "to play (instrument), to spring" },
  { hanzi: "谈", pinyin: "tán", english: "to talk, to discuss" },
  { hanzi: "汤", pinyin: "tāng", english: "soup" },
  { hanzi: "躺", pinyin: "tǎng", english: "to lie down" },
  { hanzi: "趟", pinyin: "tàng", english: "measure word for trips, journeys" },
  { hanzi: "讨论", pinyin: "tǎolùn", english: "to discuss, to talk over" },
  { hanzi: "讨厌", pinyin: "tǎoyàn", english: "disgusting, annoying; to dislike" },
  { hanzi: "特点", pinyin: "tèdiǎn", english: "characteristic, feature" },
  { hanzi: "提", pinyin: "tí", english: "to carry, to lift, to mention" },
  { hanzi: "提出", pinyin: "tíchū", english: "to put forward, to propose" },
  { hanzi: "提到", pinyin: "tídào", english: "to mention, to refer to" },
  { hanzi: "提供", pinyin: "tígōng", english: "to provide, to supply, to offer" },
  { hanzi: "提前", pinyin: "tíqián", english: "to advance, to do ahead of time" },
  { hanzi: "提醒", pinyin: "tíxǐng", english: "to remind, to alert" },
  { hanzi: "体检", pinyin: "tǐjiǎn", english: "to have a medical checkup" },
  { hanzi: "体温", pinyin: "tǐwēn", english: "body temperature" },
  { hanzi: "体重", pinyin: "tǐzhòng", english: "body weight" },
  { hanzi: "填写", pinyin: "tiánxiě", english: "to fill in, to complete a form" },
  { hanzi: "条件", pinyin: "tiáojiàn", english: "condition, requirement, terms" },
  { hanzi: "听力", pinyin: "tīnglì", english: "listening ability, hearing" },
  { hanzi: "听众", pinyin: "tīngzhòng", english: "audience, listeners" },
  { hanzi: "停", pinyin: "tíng", english: "to stop, to halt" },
  { hanzi: "停车", pinyin: "tíngchē", english: "to park, to stop a vehicle" },
  { hanzi: "停车场", pinyin: "tíngchēchǎng", english: "parking lot" },
  { hanzi: "停止", pinyin: "tíngzhǐ", english: "to stop, to cease" },
  { hanzi: "通", pinyin: "tōng", english: "to go through; to connect" },
  { hanzi: "通过", pinyin: "tōngguò", english: "to pass through; by means of" },
  { hanzi: "通知", pinyin: "tōngzhī", english: "to notify, to inform; notice" },
  { hanzi: "童年", pinyin: "tóngnián", english: "childhood" },
  { hanzi: "同时", pinyin: "tóngshí", english: "at the same time; meanwhile" },
  { hanzi: "同样", pinyin: "tóngyàng", english: "same, similar" },
  { hanzi: "桶", pinyin: "tǒng", english: "bucket, barrel" },
  { hanzi: "痛", pinyin: "tòng", english: "painful, sore; extremely" },
  { hanzi: "头痛", pinyin: "tóutòng", english: "headache" },
  { hanzi: "图", pinyin: "tú", english: "picture, drawing, diagram" },
  { hanzi: "图片", pinyin: "túpiàn", english: "picture, image, photograph" },
  { hanzi: "土", pinyin: "tǔ", english: "earth, soil, land" },
  { hanzi: "推", pinyin: "tuī", english: "to push, to shove" },
  { hanzi: "推迟", pinyin: "tuīchí", english: "to postpone, to delay" },
  { hanzi: "推出", pinyin: "tuīchū", english: "to launch, to introduce" },
  { hanzi: "脱", pinyin: "tuō", english: "to take off, to shed" },
  { hanzi: "袜子", pinyin: "wàzi", english: "socks" },
  { hanzi: "外出", pinyin: "wàichū", english: "to go out, to leave home" },
  { hanzi: "外套", pinyin: "wàitào", english: "coat, jacket" },
  { hanzi: "完全", pinyin: "wánquán", english: "complete; completely, absolutely" },
  { hanzi: "晚安", pinyin: "wǎn\'ān", english: "good night" },
  { hanzi: "晚餐", pinyin: "wǎncān", english: "dinner, supper" },
  { hanzi: "网购", pinyin: "wǎnggòu", english: "to shop online" },
  { hanzi: "往往", pinyin: "wǎngwǎng", english: "often, frequently" },
  { hanzi: "网页", pinyin: "wǎngyè", english: "webpage" },
  { hanzi: "网友", pinyin: "wǎngyǒu", english: "netizen, internet user" },
  { hanzi: "网址", pinyin: "wǎngzhǐ", english: "website URL, web address" },
  { hanzi: "危险", pinyin: "wēixiǎn", english: "dangerous; danger" },
  { hanzi: "为", pinyin: "wéi", english: "to do, to act, to serve as" },
  { hanzi: "味", pinyin: "wèi", english: "taste, flavor" },
  { hanzi: "味道", pinyin: "wèidào", english: "taste, flavor" },
  { hanzi: "卫生", pinyin: "wèishēng", english: "hygiene, sanitation; clean" },
  { hanzi: "温度", pinyin: "wēndù", english: "temperature" },
  { hanzi: "闻", pinyin: "wén", english: "to smell, to sniff" },
  { hanzi: "文件", pinyin: "wénjiàn", english: "document, file" },
  { hanzi: "文章", pinyin: "wénzhāng", english: "essay, article" },
  { hanzi: "文字", pinyin: "wénzì", english: "writing, character" },
  { hanzi: "污染", pinyin: "wūrǎn", english: "contaminated, to pollute" },
  { hanzi: "无", pinyin: "wú", english: "to lack, to not have" },
  { hanzi: "无法", pinyin: "wúfǎ", english: "unable, incapable" },
  { hanzi: "无聊", pinyin: "wúliáo", english: "boring, dull" },
  { hanzi: "无论", pinyin: "wúlùn", english: "no matter what, regardless" },
  { hanzi: "午餐", pinyin: "wǔcān", english: "lunch" },
  { hanzi: "误会", pinyin: "wùhuì", english: "to misunderstand; misunderstanding" },
  { hanzi: "吸", pinyin: "xī", english: "to suck, to inhale, to absorb" },
  { hanzi: "西部", pinyin: "xībù", english: "western region, west part" },
  { hanzi: "西红柿", pinyin: "xīhóngshì", english: "tomato" },
  { hanzi: "吸引", pinyin: "xīyǐn", english: "to attract" },
  { hanzi: "细", pinyin: "xì", english: "thin, fine, detailed" },
  { hanzi: "细心", pinyin: "xìxīn", english: "careful, attentive" },
  { hanzi: "下降", pinyin: "xiàjiàng", english: "to decline, to drop, to go down" },
  { hanzi: "鲜", pinyin: "xiān", english: "fresh" },
  { hanzi: "鲜花", pinyin: "xiānhuā", english: "fresh flower" },
  { hanzi: "咸", pinyin: "xián", english: "salty" },
  { hanzi: "现金", pinyin: "xiànjīn", english: "cash" },
  { hanzi: "羡慕", pinyin: "xiànmù", english: "to envy, to admire" },
  { hanzi: "线上", pinyin: "xiànshàng", english: "online, on the internet" },
  { hanzi: "线下", pinyin: "xiànxià", english: "offline" },
  { hanzi: "现有", pinyin: "xiànyǒu", english: "existing, currently available" },
  { hanzi: "香", pinyin: "xiāng", english: "fragrant" },
  { hanzi: "相比", pinyin: "xiāngbǐ", english: "to compare with, to contrast" },
  { hanzi: "相反", pinyin: "xiāngfǎn", english: "opposite, contrary" },
  { hanzi: "相互", pinyin: "xiānghù", english: "mutual, each other" },
  { hanzi: "相同", pinyin: "xiāngtóng", english: "same, identical" },
  { hanzi: "详细", pinyin: "xiángxì", english: "detailed, thorough" },
  { hanzi: "响", pinyin: "xiǎng", english: "to make a sound, to ring; loud" },
  { hanzi: "想法", pinyin: "xiǎngfǎ", english: "thought, idea, opinion" },
  { hanzi: "项", pinyin: "xiàng", english: "measure word for projects, items" },
  { hanzi: "消息", pinyin: "xiāoxi", english: "news, message, information" },
  { hanzi: "小吃", pinyin: "xiǎochī", english: "snack, light meal" },
  { hanzi: "小伙子", pinyin: "xiǎohuǒzi", english: "young man, lad" },
  { hanzi: "小说", pinyin: "xiǎoshuō", english: "novel, fiction" },
  { hanzi: "小组", pinyin: "xiǎozǔ", english: "small group, team" },
  { hanzi: "效果", pinyin: "xiàoguǒ", english: "effect, result" },
  { hanzi: "笑话", pinyin: "xiàohua", english: "joke; to joke, to laugh at" },
  { hanzi: "血", pinyin: "xiě", english: "blood" },
  { hanzi: "心", pinyin: "xīn", english: "heart" },
  { hanzi: "辛苦", pinyin: "xīnkǔ", english: "hard, laborious; to work hard" },
  { hanzi: "心情", pinyin: "xīnqíng", english: "mood, feeling" },
  { hanzi: "信号", pinyin: "xìnhào", english: "signal" },
  { hanzi: "信息", pinyin: "xìnxī", english: "information, message" },
  { hanzi: "信心", pinyin: "xìnxīn", english: "confidence, faith" },
  { hanzi: "兴奋", pinyin: "xīngfèn", english: "excited, thrilled" },
  { hanzi: "星星", pinyin: "xīngxing", english: "star" },
  { hanzi: "醒", pinyin: "xǐng", english: "to wake up, to sober up" },
  { hanzi: "性别", pinyin: "xìngbié", english: "gender, sex" },
  { hanzi: "幸福", pinyin: "xìngfú", english: "happiness; happy, blissful" },
  { hanzi: "性格", pinyin: "xìnggé", english: "character, personality" },
  { hanzi: "兄弟", pinyin: "xiōngdì", english: "brothers" },
  { hanzi: "熊", pinyin: "xióng", english: "bear" },
  { hanzi: "修", pinyin: "xiū", english: "to repair, to fix" },
  { hanzi: "修理", pinyin: "xiūlǐ", english: "to repair, to fix" },
  { hanzi: "许多", pinyin: "xǔduō", english: "many, numerous" },
  { hanzi: "学费", pinyin: "xuéfèi", english: "tuition fee" },
  { hanzi: "学院", pinyin: "xuéyuàn", english: "college, academy, institute" },
  { hanzi: "压", pinyin: "yā", english: "to press, to push down" },
  { hanzi: "压力", pinyin: "yālì", english: "pressure, stress" },
  { hanzi: "牙膏", pinyin: "yágāo", english: "toothpaste" },
  { hanzi: "亚洲", pinyin: "Yàzhōu", english: "Asia" },
  { hanzi: "烟", pinyin: "yān", english: "cigarette, smoke" },
  { hanzi: "盐", pinyin: "yán", english: "salt" },
  { hanzi: "严格", pinyin: "yángé", english: "strict, stringent" },
  { hanzi: "研究", pinyin: "yánjiū", english: "to research, to study" },
  { hanzi: "研究生", pinyin: "yánjiūshēng", english: "graduate student, postgraduate" },
  { hanzi: "严重", pinyin: "yánzhòng", english: "serious, severe, grave" },
  { hanzi: "演", pinyin: "yǎn", english: "to act, to perform, to play" },
  { hanzi: "演唱", pinyin: "yǎnchàng", english: "to sing, to perform vocally" },
  { hanzi: "演出", pinyin: "yǎnchū", english: "to perform, to put on a show" },
  { hanzi: "眼镜", pinyin: "yǎnjìng", english: "eyeglasses, glasses" },
  { hanzi: "眼前", pinyin: "yǎnqián", english: "before one\'s eyes, at the moment" },
  { hanzi: "演员", pinyin: "yǎnyuán", english: "actor, performer" },
  { hanzi: "阳光", pinyin: "yángguāng", english: "sunlight, sunshine" },
  { hanzi: "养成", pinyin: "yǎngchéng", english: "to develop, to cultivate, to form" },
  { hanzi: "样子", pinyin: "yàngzi", english: "appearance, look, manner" },
  { hanzi: "邀请", pinyin: "yāoqǐng", english: "to invite" },
  { hanzi: "要是", pinyin: "yàoshi", english: "if, suppose" },
  { hanzi: "钥匙", pinyin: "yàoshi", english: "key" },
  { hanzi: "也许", pinyin: "yěxǔ", english: "maybe, perhaps" },
  { hanzi: "夜", pinyin: "yè", english: "night" },
  { hanzi: "夜晚", pinyin: "yèwǎn", english: "night, evening" },
  { hanzi: "叶子", pinyin: "yèzi", english: "leaf" },
  { hanzi: "一切", pinyin: "yíqiè", english: "everything" },
  { hanzi: "已", pinyin: "yǐ", english: "already" },
  { hanzi: "以内", pinyin: "yǐnèi", english: "within" },
  { hanzi: "意见", pinyin: "yìjiàn", english: "opinion" },
  { hanzi: "一生", pinyin: "yìshēng", english: "lifetime, all one\'s life" },
  { hanzi: "艺术", pinyin: "yìshù", english: "art" },
  { hanzi: "因此", pinyin: "yīncǐ", english: "therefore" },
  { hanzi: "引起", pinyin: "yǐnqǐ", english: "to cause, to give rise to" },
  { hanzi: "印象", pinyin: "yìnxiàng", english: "impression" },
  { hanzi: "赢", pinyin: "yíng", english: "to win" },
  { hanzi: "赢得", pinyin: "yíngdé", english: "to gain, to win" },
  { hanzi: "应聘", pinyin: "yìngpìn", english: "to apply for a job" },
  { hanzi: "勇敢", pinyin: "yǒnggǎn", english: "brave, courageous" },
  { hanzi: "永远", pinyin: "yǒngyuǎn", english: "forever, always" },
  { hanzi: "用来", pinyin: "yònglái", english: "to be used for" },
  { hanzi: "用于", pinyin: "yòngyú", english: "to be used for, to be applied to" },
  { hanzi: "优点", pinyin: "yōudiǎn", english: "advantage, merit, strong point" },
  { hanzi: "幽默", pinyin: "yōumò", english: "humorous" },
  { hanzi: "优秀", pinyin: "yōuxiù", english: "excellent, outstanding" },
  { hanzi: "由", pinyin: "yóu", english: "by, through, from, because of" },
  { hanzi: "油", pinyin: "yóu", english: "oil, fat, grease" },
  { hanzi: "尤其", pinyin: "yóuqí", english: "especially, particularly" },
  { hanzi: "游玩", pinyin: "yóuwán", english: "to play, to have fun" },
  { hanzi: "由于", pinyin: "yóuyú", english: "because of, due to" },
  { hanzi: "友好", pinyin: "yǒuhǎo", english: "friendly" },
  { hanzi: "友情", pinyin: "yǒuqíng", english: "friendship (the feeling/bond)" },
  { hanzi: "有趣", pinyin: "yǒuqù", english: "interesting, enjoyable, fun" },
  { hanzi: "有效", pinyin: "yǒuxiào", english: "effective" },
  { hanzi: "友谊", pinyin: "yǒuyì", english: "friendship (formal, e.g. between nations)" },
  { hanzi: "有着", pinyin: "yǒuzhe", english: "to have, to possess" },
  { hanzi: "愉快", pinyin: "yúkuài", english: "pleasant, cheerful" },
  { hanzi: "于是", pinyin: "yúshì", english: "therefore, hence, so" },
  { hanzi: "与", pinyin: "yǔ", english: "with, and" },
  { hanzi: "语法", pinyin: "yǔfǎ", english: "grammar" },
  { hanzi: "预习", pinyin: "yùxí", english: "to preview, to prepare lessons" },
  { hanzi: "原来", pinyin: "yuánlái", english: "originally, actually; original" },
  { hanzi: "原谅", pinyin: "yuánliàng", english: "to forgive, to excuse, to pardon" },
  { hanzi: "原因", pinyin: "yuányīn", english: "cause, reason" },
  { hanzi: "远离", pinyin: "yuǎnlí", english: "to stay away from" },
  { hanzi: "院长", pinyin: "yuànzhǎng", english: "dean, head of a college" },
  { hanzi: "院子", pinyin: "yuànzi", english: "courtyard, yard" },
  { hanzi: "约", pinyin: "yuē", english: "to make an appointment; about" },
  { hanzi: "约会", pinyin: "yuēhuì", english: "to date; date, appointment" },
  { hanzi: "月饼", pinyin: "yuèbing", english: "mooncake" },
  { hanzi: "阅读", pinyin: "yuèdú", english: "to read" },
  { hanzi: "月份", pinyin: "yuèfèn", english: "month" },
  { hanzi: "云", pinyin: "yún", english: "cloud" },
  { hanzi: "允许", pinyin: "yǔnxǔ", english: "to permit, to allow" },
  { hanzi: "杂志", pinyin: "zázhì", english: "magazine" },
  { hanzi: "再次", pinyin: "zàicì", english: "once again, once more" },
  { hanzi: "再说", pinyin: "zàishuō", english: "to put off; besides, moreover" },
  { hanzi: "暂时", pinyin: "zànshí", english: "temporary, for the time being" },
  { hanzi: "暂停", pinyin: "zàntíng", english: "to suspend, to pause" },
  { hanzi: "早餐", pinyin: "zǎocān", english: "breakfast" },
  { hanzi: "早晨", pinyin: "zǎochen", english: "morning" },
  { hanzi: "责任", pinyin: "zérèn", english: "responsibility, duty" },
  { hanzi: "增加", pinyin: "zēngjiā", english: "to increase, to add, to raise" },
  { hanzi: "增长", pinyin: "zēngzhǎng", english: "to increase, to grow, to rise" },
  { hanzi: "招聘", pinyin: "zhāopìn", english: "to recruit, to hire" },
  { hanzi: "着", pinyin: "zháo", english: "to touch, to get to, to catch fire" },
  { hanzi: "着火", pinyin: "zháohuǒ", english: "to catch fire, to ignite" },
  { hanzi: "真正", pinyin: "zhēnzhèng", english: "true, genuine; truly, indeed" },
  { hanzi: "整", pinyin: "zhěng", english: "whole, complete, entire" },
  { hanzi: "整个", pinyin: "zhěnggè", english: "whole, entire, all" },
  { hanzi: "整理", pinyin: "zhěnglǐ", english: "to arrange, to tidy up" },
  { hanzi: "证", pinyin: "zhèng", english: "certificate, proof, evidence" },
  { hanzi: "正常", pinyin: "zhèngcháng", english: "normal, regular, proper" },
  { hanzi: "正好", pinyin: "zhènghǎo", english: "exactly right; coincidentally" },
  { hanzi: "证件", pinyin: "zhèngjiàn", english: "ID card, credentials" },
  { hanzi: "证明", pinyin: "zhèngmíng", english: "to prove; proof, certificate" },
  { hanzi: "正确", pinyin: "zhèngquè", english: "correct, right, accurate" },
  { hanzi: "正式", pinyin: "zhèngshì", english: "formal, official" },
  { hanzi: "支持", pinyin: "zhīchí", english: "to support, to back" },
  { hanzi: "支付", pinyin: "zhīfù", english: "to pay (money)" },
  { hanzi: "之后", pinyin: "zhīhòu", english: "after, later, behind" },
  { hanzi: "之间", pinyin: "zhījiān", english: "between, among" },
  { hanzi: "之前", pinyin: "zhīqián", english: "before, prior to" },
  { hanzi: "知识", pinyin: "zhīshi", english: "knowledge" },
  { hanzi: "之中", pinyin: "zhīzhōng", english: "among, inside" },
  { hanzi: "值", pinyin: "zhí", english: "to be worth; valuable" },
  { hanzi: "值得", pinyin: "zhídé", english: "to be worth, to deserve" },
  { hanzi: "直接", pinyin: "zhíjiē", english: "direct, straightforward" },
  { hanzi: "植物", pinyin: "zhíwù", english: "plant, vegetation" },
  { hanzi: "职业", pinyin: "zhíyè", english: "occupation, profession" },
  { hanzi: "指", pinyin: "zhǐ", english: "to point to, to indicate" },
  { hanzi: "指出", pinyin: "zhǐchū", english: "to point out, to indicate" },
  { hanzi: "只好", pinyin: "zhǐhǎo", english: "have to, be forced to" },
  { hanzi: "纸巾", pinyin: "zhǐjīn", english: "tissue paper, napkin" },
  { hanzi: "质量", pinyin: "zhìliàng", english: "quality" },
  { hanzi: "至少", pinyin: "zhìshǎo", english: "at least" },
  { hanzi: "中餐", pinyin: "zhōngcān", english: "Chinese food, Chinese meal" },
  { hanzi: "中年", pinyin: "zhōngnián", english: "middle age" },
  { hanzi: "种", pinyin: "zhòng", english: "to plant, to grow" },
  { hanzi: "重", pinyin: "zhòng", english: "weight; heavy, important" },
  { hanzi: "重点", pinyin: "zhòngdiǎn", english: "key point, emphasis" },
  { hanzi: "重视", pinyin: "zhòngshì", english: "to pay attention to, to value" },
  { hanzi: "周围", pinyin: "zhōuwéi", english: "around, surrounding" },
  { hanzi: "主意", pinyin: "zhǔyi", english: "idea, thought, plan" },
  { hanzi: "祝", pinyin: "zhù", english: "to wish, to express good wishes" },
  { hanzi: "祝贺", pinyin: "zhùhè", english: "to congratulate" },
  { hanzi: "著名", pinyin: "zhùmíng", english: "famous, well-known" },
  { hanzi: "专门", pinyin: "zhuānmén", english: "specially, specifically; special" },
  { hanzi: "专业", pinyin: "zhuānyè", english: "specialty, major; professional" },
  { hanzi: "转", pinyin: "zhuǎn", english: "to turn, to shift, to transfer" },
  { hanzi: "转发", pinyin: "zhuǎnfā", english: "to forward a message, to retweet" },
  { hanzi: "转机", pinyin: "zhuǎnjī", english: "to transfer flight, to change planes" },
  { hanzi: "赚", pinyin: "zhuàn", english: "to earn, to make a profit" },
  { hanzi: "装", pinyin: "zhuāng", english: "to load, to pack, to pretend" },
  { hanzi: "准", pinyin: "zhǔn", english: "accurate, exact; definitely" },
  { hanzi: "准确", pinyin: "zhǔnquè", english: "accurate, precise" },
  { hanzi: "准时", pinyin: "zhǔnshí", english: "on time, punctual" },
  { hanzi: "资料", pinyin: "zīliào", english: "materials, data, information" },
  { hanzi: "仔细", pinyin: "zǐxì", english: "careful, attentive, meticulous" },
  { hanzi: "自", pinyin: "zì", english: "from, since, oneself" },
  { hanzi: "自然", pinyin: "zìrán", english: "nature; natural; naturally" },
  { hanzi: "自习", pinyin: "zìxí", english: "to study on one\'s own" },
  { hanzi: "自信", pinyin: "zìxìn", english: "self-confidence; confident" },
  { hanzi: "自学", pinyin: "zìxué", english: "to teach oneself, to self-study" },
  { hanzi: "总结", pinyin: "zǒngjié", english: "to summarize; summary" },
  { hanzi: "租", pinyin: "zū", english: "to rent, to hire" },
  { hanzi: "组", pinyin: "zǔ", english: "group, team" },
  { hanzi: "最终", pinyin: "zuìzhōng", english: "final, ultimate" },
  { hanzi: "尊重", pinyin: "zūnzhòng", english: "to respect, to value" },
  { hanzi: "左右", pinyin: "zuǒyòu", english: "about, around; left and right" },
  { hanzi: "座", pinyin: "zuò", english: "seat; measure word for seats" },
  { hanzi: "做法", pinyin: "zuòfǎ", english: "way of doing things, practice" },
  { hanzi: "作家", pinyin: "zuòjiā", english: "writer, author (of literature)" },
  { hanzi: "做梦", pinyin: "zuòmèng", english: "to dream, to have a dream" },
  { hanzi: "作品", pinyin: "zuòpǐn", english: "work, composition, creation" },
  { hanzi: "作为", pinyin: "zuòwéi", english: "to act as; as, being" },
  { hanzi: "座位", pinyin: "zuòwèi", english: "seat" },
  { hanzi: "作文", pinyin: "zuòwén", english: "composition; to write a composition" },
  { hanzi: "作用", pinyin: "zuòyòng", english: "function, role" },
  { hanzi: "作者", pinyin: "zuòzhě", english: "author, writer (of a specific work)" },
  { hanzi: "者", pinyin: "zhě", english: "person who does something (suffix)" },
  { hanzi: "性", pinyin: "xìng", english: "nature, quality, -ness (suffix)" },
  { hanzi: "式", pinyin: "shì", english: "style, type, pattern (suffix)" },
  { hanzi: "化", pinyin: "huà", english: "to become, to change, -ize (suffix)" },
  { hanzi: "感", pinyin: "gǎn", english: "feeling, sense (suffix)" },
];
const MODES = [
  { id: "en-to-zh", label: "EN → 汉字", desc: "See English, type Chinese" },
  { id: "zh-to-en", label: "汉字 → EN", desc: "See Chinese, type English" },
  { id: "zh-to-py", label: "汉字 → Pinyin", desc: "See Chinese, type pinyin" },
  { id: "mc", label: "Multiple Choice", desc: "See English, pick Chinese" },
];
async function loadStorage() {
  try {
    const raw = localStorage.getItem("hsk4_progress");
    if (raw) {
      const data = JSON.parse(raw);
      return {
        badList: data.badList || [],
        mastery: data.mastery || {},
      };
    }
  } catch {}
  return { badList: [], mastery: {} };
}
async function saveStorage(badList, mastery) {
  try {
    localStorage.setItem("hsk4_progress", JSON.stringify({ badList, mastery }));
  } catch {}
}
let GLOBAL_BAD_LIST = [];
let GLOBAL_MASTERY = {};
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700&family=Space+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root[data-theme="dark"] {
    --bg-app: #0e0e12; --bg-card: #14141c; --bg-card-hover: #1e1e28; --bg-mode-btn: #1a1a22;
    --border-default: #2e2e3a; --muted-strong: #5a5a6a;
    --text-primary: #e8e0d0; --text-secondary: #c8c0b0; --text-tertiary: #a8a090; --text-muted: #7a7060; --text-faint: #5a5060;
    --accent-gold: #e8c87a; --accent-gold-dim: #9a8a60; --accent-gold-hover: #c8a840;
    --success: #5ab87a; --success-bg: #1a2e1e; --error: #c85a5a; --error-bg: #2e1a1a; --active-bg: #1e1a0a;
    --challenge-border: #7a5aa8; --challenge-text: #a88ad8; --challenge-bg: #1e1a2e;
  }
  :root[data-theme="light"] {
    --bg-app: #f7f2e7; --bg-card: #fffdf8; --bg-card-hover: #f0e8d4; --bg-mode-btn: #fffdf8;
    --border-default: #ddd0af; --muted-strong: #b6a67c;
    --text-primary: #2a2419; --text-secondary: #423a29; --text-tertiary: #5c5138; --text-muted: #8a7a56; --text-faint: #b6a67c;
    --accent-gold: #9c6f13; --accent-gold-dim: #a68d54; --accent-gold-hover: #7d5910;
    --success: #25823f; --success-bg: #e2f3e4; --error: #b23a3a; --error-bg: #fbe8e6; --active-bg: #f2e6bd;
    --challenge-border: #8a6bb0; --challenge-text: #6b4a95; --challenge-bg: #ede4f5;
  }
  .app { min-height: 100vh; background: var(--bg-app); color: var(--text-primary); font-family: 'Space Mono', monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px 16px; transition: background 0.2s, color 0.2s; }
  .top-bar { width: 100%; max-width: 420px; display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .level-tabs { position: relative; width: 78px; height: 34px; margin-top: -6px; }
  .level-tabs-svg { position: absolute; top: 0; left: 0; }
  .level-tabs-svg .lt-bg { fill: var(--bg-app); }
  .level-tabs-svg .lt-stroke-group { fill: none; stroke: var(--text-muted); stroke-width: 0.9; stroke-linecap: round; opacity: 0.75; }
  .level-tab-btn { position: absolute; left: 6px; top: 0; height: 34px; display: flex; align-items: center; background: none; border: none; padding: 0; cursor: pointer; font-family: 'Space Mono', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text-muted); }
  .theme-toggle { width: 56px; height: 30px; border-radius: 15px; background: var(--bg-card); border: 1px solid var(--border-default); position: relative; cursor: pointer; padding: 0; transition: background 0.2s, border-color 0.2s; }
  .theme-toggle-knob { position: absolute; top: 2px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: var(--accent-gold); display: flex; align-items: center; justify-content: center; font-size: 13px; transition: transform 0.2s ease; }
  .theme-toggle.is-light .theme-toggle-knob { transform: translateX(26px); }
  .title { font-family: 'Noto Serif SC', serif; font-size: 2.2rem; font-weight: 700; color: var(--accent-gold); letter-spacing: 0.08em; margin-bottom: 4px; text-align: center; }
  .subtitle { font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 20px; }
  .mode-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%; max-width: 420px; }
  .mode-btn { background: var(--bg-mode-btn); border: 1px solid var(--border-default); border-radius: 10px; padding: 18px 14px; cursor: pointer; text-align: left; transition: all 0.15s; color: var(--text-primary); }
  .mode-btn:hover { border-color: var(--accent-gold); background: var(--bg-card-hover); }
  .mode-label { font-size: 0.95rem; font-weight: 700; color: var(--accent-gold); margin-bottom: 5px; }
  .mode-desc { font-size: 0.68rem; color: var(--text-muted); }
  .card { background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 16px; padding: 32px 24px 24px; width: 100%; max-width: 480px; }
  .progress-bar { height: 3px; background: var(--border-default); border-radius: 2px; margin-bottom: 24px; overflow: hidden; }
  .progress-fill { height: 100%; background: var(--accent-gold); border-radius: 2px; transition: width 0.3s; }
  .score-line { font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 20px; }
  .prompt-label { font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; }
  .prompt-zh { font-family: 'Noto Serif SC', serif; font-size: 3rem; color: var(--text-primary); margin-bottom: 6px; line-height: 1.2; }
  .prompt-en { font-family: 'Space Mono', monospace; font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 6px; line-height: 1.5; }
  .pinyin-hint { font-size: 2.8rem; color: var(--accent-gold-dim); margin-bottom: 20px; min-height: 60px; cursor: pointer; transition: color 0.2s; letter-spacing: 0.08em; font-family: 'Space Mono', monospace; }
  .pinyin-tap-hint { font-size: 0.62rem; color: var(--text-faint); letter-spacing: 0.15em; margin-bottom: 20px; cursor: pointer; min-height: 56px; display: flex; align-items: center; }
  .pinyin-hint:hover { color: var(--accent-gold-hover); }
  .pinyin-hint.revealed { color: var(--accent-gold); font-weight: 700; }
  .spacer { margin-bottom: 20px; }
  .input-field { width: 100%; background: var(--bg-app); border: 1px solid var(--border-default); border-radius: 8px; padding: 14px 16px; color: var(--text-primary); font-family: 'Space Mono', monospace; font-size: 1rem; outline: none; margin-bottom: 14px; transition: border-color 0.15s; }
  .input-field:focus { border-color: var(--accent-gold); }
  .char-hint { font-size: 0.65rem; color: var(--muted-strong); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 10px; }
  .char-hint span { color: var(--accent-gold); font-size: 0.8rem; }
  .input-correct { border-color: var(--success) !important; }
  .input-wrong { border-color: var(--error) !important; }
  .submit-btn { width: 100%; background: var(--accent-gold); color: var(--bg-app); border: none; border-radius: 8px; padding: 13px; font-family: 'Space Mono', monospace; font-size: 0.85rem; font-weight: 700; cursor: pointer; letter-spacing: 0.1em; transition: opacity 0.15s; }
  .submit-btn:hover { opacity: 0.88; }
  .submit-btn:disabled { opacity: 0.35; cursor: default; }
  .result-box { border-radius: 8px; padding: 14px 16px; margin-bottom: 14px; font-size: 0.85rem; }
  .result-correct { background: var(--success-bg); border: 1px solid var(--success); color: var(--success); }
  .result-wrong { background: var(--error-bg); border: 1px solid var(--error); color: var(--error); }
  .result-ans { color: var(--text-primary); font-size: 1.05rem; margin-top: 4px; }
  .mc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .mc-btn { background: var(--bg-app); border: 1px solid var(--border-default); border-radius: 8px; padding: 18px 10px; color: var(--text-primary); font-family: 'Noto Serif SC', serif; font-size: 1.9rem; cursor: pointer; text-align: center; transition: all 0.15s; line-height: 1.2; }
  .mc-btn:hover:not(:disabled) { border-color: var(--accent-gold); }
  .mc-chosen-correct { border-color: var(--success) !important; background: var(--success-bg) !important; color: var(--success) !important; }
  .mc-chosen-wrong { border-color: var(--error) !important; background: var(--error-bg) !important; color: var(--error) !important; }
  .mc-reveal { border-color: var(--success) !important; color: var(--success) !important; }
  .mc-pinyin { font-family: 'Space Mono', monospace; font-size: 1.05rem; color: inherit; opacity: 0.8; margin-top: 5px; }
  .next-btn { width: 100%; background: transparent; border: 1px solid var(--accent-gold); border-radius: 8px; padding: 12px; color: var(--accent-gold); font-family: 'Space Mono', monospace; font-size: 0.85rem; cursor: pointer; letter-spacing: 0.1em; transition: all 0.15s; }
  .next-btn:hover { background: var(--accent-gold); color: var(--bg-app); }
  .done-card { text-align: center; max-width: 420px; width: 100%; }
  .done-pct { font-family: 'Noto Serif SC', serif; font-size: 5rem; color: var(--accent-gold); line-height: 1; margin-bottom: 8px; }
  .done-label { font-size: 0.7rem; color: var(--text-muted); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; }
  .done-sub { font-size: 0.85rem; color: var(--text-tertiary); margin-bottom: 16px; }
  .done-btns { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; }
  .btn-gold { background: var(--accent-gold); color: var(--bg-app); border: none; border-radius: 8px; padding: 12px 18px; font-family: 'Space Mono', monospace; font-size: 0.78rem; font-weight: 700; cursor: pointer; }
  .btn-outline { background: transparent; border: 1px solid var(--accent-gold); color: var(--accent-gold); border-radius: 8px; padding: 12px 18px; font-family: 'Space Mono', monospace; font-size: 0.78rem; cursor: pointer; }
  .btn-red { background: transparent; border: 1px solid var(--error); color: var(--error); border-radius: 8px; padding: 12px 18px; font-family: 'Space Mono', monospace; font-size: 0.78rem; cursor: pointer; }
  .back-btn { background: transparent; border: 1px solid var(--border-default); border-radius: 8px; padding: 8px 16px; color: var(--text-muted); font-family: 'Space Mono', monospace; font-size: 0.7rem; cursor: pointer; margin-bottom: 20px; letter-spacing: 0.1em; transition: all 0.15s; }
  .back-btn:hover { color: var(--text-primary); border-color: var(--muted-strong); }
  .mastery-box { width: 100%; max-width: 420px; margin-bottom: 24px; }
  .mastery-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
  .mastery-label { font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.18em; text-transform: uppercase; }
  .mastery-count { font-size: 0.75rem; color: var(--accent-gold); font-weight: 700; }
  .mastery-bar-bg { height: 6px; background: var(--border-default); border-radius: 3px; overflow: hidden; }
  .mastery-bar-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--success), var(--accent-gold)); transition: width 0.5s ease; }
  .mastery-sub { font-size: 0.6rem; color: var(--muted-strong); margin-top: 5px; }
  .done-mastery { margin: 14px 0 20px; padding: 14px 18px; background: var(--bg-app); border: 1px solid var(--border-default); border-radius: 10px; text-align: left; }
  .done-mastery-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .done-mastery-label { font-size: 0.62rem; color: var(--text-muted); letter-spacing: 0.15em; text-transform: uppercase; }
  .done-mastery-val { font-size: 0.82rem; color: var(--accent-gold); font-weight: 700; }
  .done-mastery-bar-bg { height: 4px; background: var(--border-default); border-radius: 2px; overflow: hidden; }
  .done-mastery-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--success), var(--accent-gold)); transition: width 0.5s; }
  .bad-badge { display: inline-block; background: var(--error-bg); border: 1px solid var(--error); color: var(--error); border-radius: 6px; font-size: 0.6rem; padding: 2px 7px; margin-left: 8px; vertical-align: middle; letter-spacing: 0.1em; }
  .range-box { width: 100%; max-width: 420px; margin-bottom: 20px; background: var(--bg-card); border: 1px solid var(--border-default); border-radius: 12px; padding: 16px; }
  .range-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px; }
  .range-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .range-group { display: flex; flex-direction: column; gap: 5px; min-width: 0; }
  .range-label { font-size: 0.58rem; color: var(--text-muted); letter-spacing: 0.15em; text-transform: uppercase; }
  .range-select { width: 100%; background: var(--bg-app); border: 1px solid var(--border-default); border-radius: 6px; color: var(--text-primary); font-family: 'Space Mono', monospace; font-size: 0.72rem; padding: 8px 10px; outline: none; cursor: pointer; }
  .range-select:focus { border-color: var(--accent-gold); }
  .range-main { display: flex; align-items: flex-start; gap: 8px; }
  .range-left { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .range-presets { display: flex; flex-wrap: wrap; gap: 6px; align-content: flex-start; }
  .subrange-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
  .subrange-col { display: flex; flex-direction: column; align-items: center; border: 1px solid var(--border-default); border-radius: 6px 0 0 6px; padding: 3px 8px; margin-right: -16px; }
  .subrange-num { font-size: 0.52rem; color: var(--text-muted); font-family: 'Space Mono', monospace; line-height: 1; padding: 1px 0; }
  .subrange-dot { width: 16px; height: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: none; border: none; padding: 0; touch-action: none; user-select: none; -webkit-user-select: none; }
  .subrange-dot::before { content: ''; width: 3px; height: 3px; border-radius: 50%; background: var(--text-faint); transition: all 0.15s; }
  .subrange-dot:hover::before { background: var(--accent-gold); width: 5px; height: 5px; }
  .subrange-dot-active::before { background: var(--accent-gold); width: 5px; height: 5px; }
  .preset-btn { background: var(--bg-app); border: 1px solid var(--border-default); border-radius: 6px; color: var(--text-muted); font-family: 'Space Mono', monospace; font-size: 0.62rem; padding: 5px 9px; cursor: pointer; transition: all 0.15s; }
  .preset-btn:hover { border-color: var(--accent-gold); color: var(--text-primary); }
  .preset-active { border-color: var(--accent-gold) !important; color: var(--accent-gold) !important; background: var(--active-bg) !important; }
  .challenge-btn { border-color: var(--challenge-border) !important; color: var(--challenge-text) !important; }
  .challenge-btn:hover { background: var(--challenge-bg) !important; }
  .challenge-btn.preset-active { background: var(--challenge-bg) !important; }
  .challenge-outline { border-color: var(--challenge-text) !important; color: var(--challenge-text) !important; }
  .threshold-input { width: 28px; background: var(--bg-app); border: 1px solid var(--challenge-text); border-radius: 4px; color: var(--challenge-text); font-family: 'Space Mono', monospace; font-size: 0.62rem; padding: 3px 4px; outline: none; }
  .threshold-chip { background: var(--challenge-bg); border: 1px solid var(--challenge-border); border-radius: 4px; color: var(--challenge-text); font-family: 'Space Mono', monospace; font-size: 0.62rem; padding: 4px 7px; cursor: pointer; }
  .threshold-chip:hover { border-color: var(--challenge-text); }
  .challenge-row { display: flex; align-items: center; gap: 6px; margin-top: 10px; }
`;
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function getWrongChoices(correct, n = 3) {
  const others = HSK4_WORDS.filter(w => w.hanzi !== correct.hanzi);
  return shuffle(others).slice(0, n);
}
function normalizePinyin(s) {
  return s.trim().toLowerCase()
    .replace(/[āáǎà]/g, "a").replace(/[ēéěè]/g, "e")
    .replace(/[īíǐì]/g, "i").replace(/[ōóǒò]/g, "o")
    .replace(/[ūúǔù]/g, "u").replace(/[ǖǘǚǜ]/g, "u")
    .replace(/\s+/g, "");
}
function normalizeEn(s) {
  return s.trim().toLowerCase().replace(/[^a-z\s]/g, "").replace(/\s+/g, " ").trim();
}
// TOTAL is now controlled by roundSize state
export default function App() {
  const [mode, setMode] = useState(null);
  const [isBadListSession, setIsBadListSession] = useState(false);
  const [pool, setPool] = useState([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [mcChoices, setMcChoices] = useState([]);
  const [result, setResult] = useState(null);
  const [correctAns, setCorrectAns] = useState("");
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);
  const [showPinyin, setShowPinyin] = useState(false);
  const [chosen, setChosen] = useState(null);
  const [badList, setBadList] = useState(GLOBAL_BAD_LIST);
  const [mastery, setMastery] = useState(GLOBAL_MASTERY);
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(HSK4_WORDS.length - 1);
  const [roundSize, setRoundSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [challengeThreshold, setChallengeThreshold] = useState(4);
  const [challengeFilter, setChallengeFilter] = useState(false);
  const [editingThreshold, setEditingThreshold] = useState(false);
  const [dragAnchorIdx, setDragAnchorIdx] = useState(null);
  const dragBaseRef = useRef(0);
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("hsk4_theme") || "dark"; } catch { return "dark"; }
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("hsk4_theme", theme); } catch {}
  }, [theme]);
  useEffect(() => {
    loadStorage().then(({ badList, mastery }) => {
      GLOBAL_BAD_LIST = badList;
      GLOBAL_MASTERY = mastery;
      setBadList([...badList]);
      setMastery({ ...mastery });
      setLoading(false);
    });
  }, []);
  const nextBtnRef = useRef(null);
  useEffect(() => {
    if (result && nextBtnRef.current) {
      nextBtnRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [result]);
  function removeFromBadList(word) {
    GLOBAL_BAD_LIST = GLOBAL_BAD_LIST.filter(w => w.hanzi !== word.hanzi);
    setBadList([...GLOBAL_BAD_LIST]);
    saveStorage(GLOBAL_BAD_LIST, GLOBAL_MASTERY);
  }
  function addToBadList(word) {
    if (!GLOBAL_BAD_LIST.find(w => w.hanzi === word.hanzi)) {
      GLOBAL_BAD_LIST = [...GLOBAL_BAD_LIST, word];
      setBadList([...GLOBAL_BAD_LIST]);
      saveStorage(GLOBAL_BAD_LIST, GLOBAL_MASTERY);
    }
  }
  function clearBadList() {
    GLOBAL_BAD_LIST = [];
    setBadList([]);
    saveStorage([], GLOBAL_MASTERY);
  }
  function recordAnswer(word, correct) {
    const prev = GLOBAL_MASTERY[word.hanzi] || { seen: 0, lastCorrect: false, timesOnBadList: 0, correctStreak: 0, lastPracticedAt: 0 };
    GLOBAL_MASTERY = {
      ...GLOBAL_MASTERY,
      [word.hanzi]: {
        seen: prev.seen + 1,
        lastCorrect: correct,
        timesOnBadList: correct ? (prev.timesOnBadList || 0) : (prev.timesOnBadList || 0) + 1,
        correctStreak: correct ? (prev.correctStreak || 0) + 1 : 0,
        lastPracticedAt: Date.now(),
      }
    };
    setMastery({ ...GLOBAL_MASTERY });
    saveStorage(GLOBAL_BAD_LIST, GLOBAL_MASTERY);
    if (correct) { removeFromBadList(word); } else { addToBadList(word); }
  }
  const masteredCount = Object.values(mastery).filter(m => m.lastCorrect === true).length;
  const seenCount = Object.keys(mastery).length;
  const totalWords = HSK4_WORDS.length;
  const SUBRANGE_MARKS = [0, 20, 40, 60, 80, 100];
  function applyBlockRange(base, startIdx, endIdx) {
    const lo = Math.min(startIdx, endIdx);
    const hi = Math.max(startIdx, endIdx);
    setRangeStart(Math.min(base + SUBRANGE_MARKS[lo], totalWords - 1));
    setRangeEnd(Math.min(base + SUBRANGE_MARKS[hi + 1] - 1, totalWords - 1));
  }
  useEffect(() => {
    if (dragAnchorIdx === null) return;
    function handleMove(e) {
      const point = e.touches ? e.touches[0] : e;
      const el = document.elementFromPoint(point.clientX, point.clientY);
      const dotEl = el && el.closest && el.closest("[data-dot-index]");
      if (dotEl) {
        applyBlockRange(dragBaseRef.current, dragAnchorIdx, Number(dotEl.getAttribute("data-dot-index")));
      }
    }
    function handleUp() { setDragAnchorIdx(null); }
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
    };
  }, [dragAnchorIdx]);
  function buildMC(p, i) {
    const wrong = getWrongChoices(p[i], 3);
    setMcChoices(shuffle([p[i], ...wrong]));
  }
  function getChallengingWords(fromList) {
    const base = fromList || HSK4_WORDS;
    return base
      .filter(w => {
        const m = GLOBAL_MASTERY[w.hanzi];
        return m && (m.timesOnBadList || 0) >= challengeThreshold && (m.correctStreak || 0) < 3;
      })
      .sort((a, b) => (GLOBAL_MASTERY[a.hanzi].lastPracticedAt || 0) - (GLOBAL_MASTERY[b.hanzi].lastPracticedAt || 0));
  }
  function startQuiz(m, existingPool, badListSession = false) {
    const rangeWords = HSK4_WORDS.slice(rangeStart, rangeEnd + 1);
    const eligible = challengeFilter
      ? getChallengingWords(rangeWords).slice(0, roundSize)
      : rangeWords;
    if (eligible.length === 0) return;
    const p = existingPool || shuffle(eligible).slice(0, Math.min(roundSize, eligible.length));
    setPool(p); setMode(m); setIsBadListSession(badListSession);
    setIndex(0); setScore({ correct: 0, total: 0 }); setResult(null);
    setInput(""); setDone(false); setShowPinyin(false); setChosen(null);
    if (m === "mc") buildMC(p, 0);
  }
  function startBadList(m) {
    if (GLOBAL_BAD_LIST.length === 0) return;
    startQuiz(m, shuffle([...GLOBAL_BAD_LIST]), true);
  }
  function replay() { startQuiz(mode, pool, isBadListSession); }
  function advance() {
    const total = pool.length;
    const next = index + 1;
    if (next >= total) { setDone(true); return; }
    setIndex(next); setResult(null); setInput(""); setShowPinyin(false); setChosen(null);
    if (mode === "mc") buildMC(pool, next);
  }
  function checkTyped() {
    const cur = pool[index];
    let ans, correct;
    if (mode === "en-to-zh") {
      ans = cur.hanzi; correct = input.trim() === ans;
    } else if (mode === "zh-to-py") {
      ans = cur.pinyin; correct = normalizePinyin(input) === normalizePinyin(ans);
    } else {
      ans = cur.english;
      const opts = ans.replace(/\(.*?\)/g, "").split(/[,\/;]/).map(s => normalizeEn(s));
      correct = opts.some(o => normalizeEn(input) === o) || normalizeEn(input) === normalizeEn(ans);
    }
    setCorrectAns(ans); setResult(correct ? "correct" : "wrong");
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(cur, correct);
  }
  function checkMC(choiceIdx) {
    if (result) return;
    const cur = pool[index];
    const choice = mcChoices[choiceIdx];
    setChosen(choiceIdx);
    const correct = choice.hanzi === cur.hanzi;
    setCorrectAns(`${cur.hanzi} · ${cur.pinyin}`);
    setResult(correct ? "correct" : "wrong");
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    recordAnswer(cur, correct);
  }
  const cur = pool[index];
  const poolSize = pool.length || roundSize;
  const pct = done ? Math.round((score.correct / score.total) * 100) : 0;
  const progress = poolSize ? (index / poolSize) * 100 : 0;
  const currentBadList = GLOBAL_BAD_LIST;
  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="title">HSK 4</div>
        <div style={{ color: "var(--muted-strong)", fontSize: "0.7rem", letterSpacing: "0.2em", marginTop: 16 }}>LOADING PROGRESS…</div>
      </div>
    </>
  );
  if (!mode) return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="top-bar">
          <div className="level-tabs">
            <svg className="level-tabs-svg" width="78" height="34" viewBox="0 0 78 34">
              <rect className="lt-bg" x="0" y="0" width="78" height="34" />
              <g className="lt-stroke-group">
                <path d="M 0 7 L 49 7 C 57 7 60.55 12 65 17" />
                <path d="M 65 17 C 62 24 60 27 51 27 L 0 27" />
                <path d="M 65 17 L 73.9 7" />
              </g>
            </svg>
            <button type="button" className="level-tab-btn">HSK 4</button>
          </div>
          <button
            type="button"
            className={`theme-toggle${theme === "light" ? " is-light" : ""}`}
            onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          >
            <span className="theme-toggle-knob">{theme === "dark" ? "🌙" : "☀️"}</span>
          </button>
        </div>
        <div className="title">HSK 4</div>
        <div className="subtitle">New HSK 3.0 Level 4 · {totalWords} words</div>
        <div className="range-box">
          <div className="range-header">
            <span className="mastery-label">Word Range</span>
            <span className="mastery-count">#{rangeStart + 1} – #{rangeEnd + 1} <span style={{color:"var(--muted-strong)"}}>({rangeEnd - rangeStart + 1} words)</span></span>
          </div>
          {(() => {
            const hundredBase = Math.floor(rangeStart / 100) * 100;
            const isFullRange = rangeStart === 0 && rangeEnd === totalWords - 1;
            const relStart = rangeStart - hundredBase;
            const relEnd = rangeEnd - hundredBase;
            return (
              <div className="range-main">
                <div className="range-left">
                  <div className="range-row">
                    <div className="range-group">
                      <label className="range-label">From</label>
                      <select className="range-select" value={rangeStart} onChange={e => setRangeStart(Math.min(Number(e.target.value), rangeEnd))}>
                        {Array.from({length: totalWords}, (_, i) => (
                          <option key={i} value={i}>#{i + 1} {HSK4_WORDS[i].hanzi}</option>
                        ))}
                      </select>
                    </div>
                    <div className="range-group">
                      <label className="range-label">To</label>
                      <select className="range-select" value={rangeEnd} onChange={e => setRangeEnd(Math.max(Number(e.target.value), rangeStart))}>
                        {Array.from({length: totalWords}, (_, i) => (
                          <option key={i} value={i}>#{i + 1} {HSK4_WORDS[i].hanzi}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="range-presets">
                    {[[0,99],[100,199],[200,299],[300,399],[400,499],[500,599],[600,699],[700,799],[800,899],[900,totalWords-1],[0,totalWords-1]].map(([s,e]) => {
                      const cappedE = Math.min(e, totalWords - 1);
                      const isAllPreset = s === 0 && cappedE === totalWords - 1;
                      const isActive = isAllPreset
                        ? isFullRange
                        : (!isFullRange && hundredBase === s && rangeStart >= s && rangeEnd <= cappedE);
                      return (
                        <button key={s+"-"+e} className={`preset-btn${isActive ? " preset-active" : ""}`}
                          onClick={() => { setRangeStart(s); setRangeEnd(cappedE); }}>
                          {isAllPreset ? "All" : `${s+1}–${cappedE+1}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="subrange-wrap">
                  <span className="subrange-num" style={{visibility: "hidden"}} aria-hidden="true">0</span>
                  <span className="subrange-dot" style={{visibility: "hidden"}} aria-hidden="true" />
                  <div className="subrange-col">
                  {SUBRANGE_MARKS.flatMap((m, i, marks) => {
                    const els = [<span key={`n${m}`} className="subrange-num">{m}</span>];
                    if (i < marks.length - 1) {
                      const subStart = marks[i];
                      const subEnd = marks[i + 1] - 1;
                      const dotActive = relEnd < 100 && relStart >= 0 && subStart >= relStart && subEnd <= relEnd;
                      els.push(
                        <button
                          key={`d${m}`}
                          type="button"
                          data-dot-index={i}
                          className={`subrange-dot${dotActive ? " subrange-dot-active" : ""}`}
                          aria-label={`Select ${subStart + 1}-${subEnd + 1} of current block`}
                          onPointerDown={(e) => {
                            if (e.currentTarget.releasePointerCapture) {
                              try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
                            }
                            dragBaseRef.current = hundredBase;
                            setDragAnchorIdx(i);
                            applyBlockRange(hundredBase, i, i);
                          }}
                        />
                      );
                    }
                    return els;
                  })}
                  </div>
                </div>
              </div>
            );
          })()}
          <div className="challenge-row">
            <button
              className={`preset-btn challenge-btn${challengeFilter ? " preset-active" : ""}`}
              onClick={() => { setChallengeFilter(v => !v); setEditingThreshold(false); }}
            >
              Hard ({getChallengingWords(HSK4_WORDS.slice(rangeStart, rangeEnd + 1)).length})
            </button>
            {challengeFilter && !editingThreshold && (
              <button className="threshold-chip" onClick={() => setEditingThreshold(true)}>
                Threshold {challengeThreshold}
              </button>
            )}
            {challengeFilter && editingThreshold && (
              <input
                className="threshold-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                defaultValue={challengeThreshold}
                onBlur={e => { setChallengeThreshold(Math.max(1, Number(e.target.value) || 4)); setEditingThreshold(false); }}
                onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
              />
            )}
          </div>
        </div>
        <div className="mastery-box">
          <div className="mastery-header">
            <span className="mastery-label">Overall Mastery</span>
            <span className="mastery-count">{masteredCount} / {totalWords}</span>
          </div>
          <div className="mastery-bar-bg">
            <div className="mastery-bar-fill" style={{ width: `${(masteredCount / totalWords) * 100}%` }} />
          </div>
          <div className="mastery-sub">{seenCount} seen · {totalWords - seenCount} unseen · {currentBadList.length} on bad list</div>
        </div>
        <div className="range-box" style={{marginBottom: 16}}>
          <div className="range-header" style={{marginBottom: 10}}>
            <span className="mastery-label">Round Size</span>
            <span className="mastery-count">{roundSize} words</span>
          </div>
          <div className="range-presets">
            {[20, 50, 100].map(n => (
              <button key={n} className={`preset-btn${roundSize === n ? " preset-active" : ""}`}
                onClick={() => setRoundSize(n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="mode-grid">
          {MODES.map(m => (
            <button key={m.id} className="mode-btn" onClick={() => startQuiz(m.id)}>
              <div className="mode-label">{m.label}</div>
              <div className="mode-desc">{m.desc}</div>
            </button>
          ))}
        </div>
        {currentBadList.length > 0 && (
          <div style={{ marginTop: 16, width: "100%", maxWidth: 420, display: "flex", gap: 8 }}>
            <button className="btn-red" style={{ flex: 1 }} onClick={() => startBadList("mc")}>🔴 Bad List ({currentBadList.length} words)</button>
            <button className="btn-outline" style={{ fontSize: "0.7rem", padding: "10px 12px" }} onClick={clearBadList}>Clear</button>
          </div>
        )}
      </div>
    </>
  );
  if (done) return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="done-card">
          <div className="done-pct">{pct}%</div>
          <div className="done-label">{isBadListSession ? "Bad List Round" : "This Round"}</div>
          <div className="done-sub">{score.correct} / {score.total} correct</div>
          <div className="done-mastery">
            <div className="done-mastery-row">
              <span className="done-mastery-label">Overall Mastery</span>
              <span className="done-mastery-val">{masteredCount} / {totalWords}</span>
            </div>
            <div className="done-mastery-bar-bg">
              <div className="done-mastery-bar-fill" style={{ width: `${(masteredCount / totalWords) * 100}%` }} />
            </div>
            <div className="mastery-sub" style={{ marginTop: 6 }}>{seenCount} seen · {totalWords - seenCount} unseen · {currentBadList.length} still on bad list</div>
          </div>
          <div className="done-btns">
            <button className="btn-gold" onClick={replay}>Replay</button>
            <button className="btn-gold" onClick={() => startQuiz(mode)}>New {roundSize}</button>
            {currentBadList.length > 0 && <button className="btn-red" onClick={() => startBadList(mode)}>Bad List ({currentBadList.length})</button>}
            {getChallengingWords(HSK4_WORDS.slice(rangeStart, rangeEnd + 1)).length > 0 && (
              <button className="btn-outline challenge-outline" onClick={() => { setChallengeFilter(true); startQuiz(mode); }}>
                Hard ({getChallengingWords(HSK4_WORDS.slice(rangeStart, rangeEnd + 1)).length})
              </button>
            )}
            <button className="btn-outline" onClick={() => setMode(null)}>← Home</button>
          </div>
        </div>
      </div>
    </>
  );
  const isChinesePrompt = mode !== "en-to-zh";
  const isOnBadList = cur && currentBadList.find(w => w.hanzi === cur.hanzi);
  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <button className="back-btn" onClick={() => setMode(null)}>← home</button>
        <div className="card">
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <div className="score-line">
            {index + 1} / {poolSize} · {score.correct} correct
            {isBadListSession && <span style={{ color: "var(--error)", marginLeft: 8 }}>BAD LIST</span>}
            {isOnBadList && !isBadListSession && <span className="bad-badge">bad list</span>}
          </div>
          <div className="prompt-label">{mode === "mc" ? "English" : isChinesePrompt ? "Chinese" : "English"}</div>
          {mode === "mc"
            ? <div className="prompt-en">{cur?.english}</div>
            : isChinesePrompt
              ? <div className="prompt-zh">{cur?.hanzi}</div>
              : <div className="prompt-en">{cur?.english}</div>
          }
          {mode === "en-to-zh" && cur && (
            <div className="char-hint"><span>{cur.hanzi.length}</span> character{cur.hanzi.length !== 1 ? "s" : ""}</div>
          )}
          {isChinesePrompt && mode !== "mc"
            ? showPinyin
              ? <div className="pinyin-hint revealed" onClick={() => setShowPinyin(v => !v)}>{cur?.pinyin}</div>
              : <div className="pinyin-tap-hint" onClick={() => setShowPinyin(v => !v)}>[ tap to reveal pinyin ]</div>
            : <div className="spacer" />
          }
          {mode === "mc" ? (
            <div className="mc-grid">
              {mcChoices.map((ch, idx) => {
                const isCorrect = ch.hanzi === pool[index]?.hanzi;
                let cls = "mc-btn";
                if (result !== null) {
                  if (isCorrect && idx === chosen) cls = "mc-btn mc-chosen-correct";
                  else if (isCorrect) cls = "mc-btn mc-reveal";
                  else if (idx === chosen) cls = "mc-btn mc-chosen-wrong";
                }
                return (
                  <button key={ch.hanzi} className={cls} disabled={result !== null} onClick={() => checkMC(idx)}>
                    {ch.hanzi}
                    {result !== null && <div className="mc-pinyin">{ch.pinyin}</div>}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <input
                className={`input-field${result === "correct" ? " input-correct" : result === "wrong" ? " input-wrong" : ""}`}
                placeholder={mode === "en-to-zh" ? "Type in Chinese..." : mode === "zh-to-py" ? "Type pinyin..." : "Type English meaning..."}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && !result && input.trim()) checkTyped();
                  else if (e.key === "Enter" && result) advance();
                }}
                disabled={!!result}
                autoFocus
              />
              {!result && <button className="submit-btn" disabled={!input.trim()} onClick={checkTyped}>CHECK</button>}
            </>
          )}
          {result && (
            <>
              <div className={`result-box ${result === "correct" ? "result-correct" : "result-wrong"}`}>
                {result === "correct" ? "✓ Correct!" : "✗ Incorrect"}
                <div className="result-ans">Answer: {correctAns}{(mode === "zh-to-py" || mode === "en-to-zh") && cur?.pinyin !== correctAns ? ` · ${cur?.pinyin}` : ""}</div>
              </div>
              <button className="next-btn" ref={nextBtnRef} onClick={advance}>{index + 1 >= poolSize ? "SEE RESULTS →" : "NEXT →"}</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
