import { db, authorsTable, notesTable } from './drizzle'

export async function seed() {
  const authors = [
    {
      userName: '小红书美妆达人',
      userXhsId: 'beauty_expert_2024',
      subscribers: 125000,
      followers: 89000,
      likes: 2450000,
      profileUrl: null,
      otherNotes: [],
      report: '# 美妆达人分析报告\n\n这位博主专注于**日常美妆教程**和**产品测评**，内容质量较高。\n\n## 内容特点\n- 🎨 注重实用性\n- 💄 产品推荐真实\n- ✨ 教程详细易懂\n\n## 粉丝画像\n主要是18-30岁的女性用户，对美妆有浓厚兴趣。',
    },
    {
      userName: '时尚穿搭小助手',
      userXhsId: 'fashion_helper',
      subscribers: 98000,
      followers: 156000,
      likes: 3200000,
      profileUrl: null,
      otherNotes: [],
      report: '# 时尚穿搭博主分析\n\n专业的**时尚穿搭**指导，风格多样化。\n\n## 优势\n- 👗 搭配思路清晰\n- 💰 预算友好\n- 📸 图片质量高\n\n深受学生党和上班族喜爱。',
    },
  ]

  const insertedAuthors = await db.insert(authorsTable).values(authors).returning()

  const notes = [
    {
      authorId: insertedAuthors[0].id,
      title: '秋日温柔妆容教程 | 新手也能轻松上手',
      description: '分享一个超适合秋天的温柔妆容，用平价产品也能打造出高级感！这个妆容主要以大地色系为主，温柔自然，非常适合日常上班和约会。整个妆容重点在于打造自然底妆和温柔眼妆，让你看起来气色很好但又不会过于浓重。',
      likes: 8520,
      collects: 3240,
      isTop10: true,
      rawJson: { content: '详细教程内容...', tags: ['美妆', '教程', '平价'] },
    },
    {
      authorId: insertedAuthors[0].id,
      title: '平价好物推荐 | 学生党必备美妆清单',
      description: '整理了一份学生党美妆清单，都是亲测好用的平价产品！包含底妆、眼妆、唇妆等各个方面。',
      likes: 6750,
      collects: 2890,
      isTop10: false,
      rawJson: { content: '产品推荐内容...', tags: ['平价', '学生党', '推荐'] },
    },
    {
      authorId: insertedAuthors[0].id,
      title: '夏日清透底妆分享',
      description: '夏天最怕底妆厚重闷痘，这套清透底妆公式让你一整天都清爽不脱妆！先用妆前乳打底，再用气垫或粉底液轻薄上妆，最后用散粉定妆。记住少量多次是关键，宁可多上几遍也不要一次涂太厚。这样的底妆既有遮瑕力又很自然，而且持妆时间也很长。',
      likes: 4230,
      collects: 1890,
      isTop10: false,
      rawJson: { content: '底妆教程内容...', tags: ['底妆', '夏日', '清透'] },
    },
    {
      authorId: insertedAuthors[1].id,
      title: '秋冬穿搭公式 | 一衣多穿不踩雷',
      description: '分享几个秋冬穿搭公式，让你轻松搭配出时髦look！公式一：针织衫+半身裙+靴子；公式二：大衣+毛衣+牛仔裤；公式三：卫衣+阔腿裤+小白鞋。这些搭配公式简单易学，而且可以根据自己的风格进行调整。',
      likes: 12300,
      collects: 5670,
      isTop10: true,
      rawJson: { content: '穿搭公式内容...', tags: ['穿搭', '秋冬', '公式'] },
    },
    {
      authorId: insertedAuthors[1].id,
      title: '小个子女生穿搭指南 | 显高技巧大公开',
      description: '小个子女生的穿搭烦恼？这些显高技巧一定要学会！',
      likes: 9870,
      collects: 4320,
      isTop10: false,
      rawJson: { content: '显高技巧内容...', tags: ['小个子', '显高', '技巧'] },
    },
    {
      authorId: insertedAuthors[1].id,
      title: '冬日温暖搭配 | 既要风度也要温度',
      description: '寒冷的冬天也要美美的！分享几套既保暖又时髦的搭配方案。羽绒服不一定臃肿，选对款式和搭配方法，一样可以很时髦。长款羽绒服配skinny牛仔裤和短靴，短款羽绒服配阔腿裤和运动鞋，都是很好的选择。重点是要注意比例和层次感。',
      likes: 7650,
      collects: 3210,
      isTop10: false,
      rawJson: { content: '冬日搭配内容...', tags: ['冬日', '保暖', '搭配'] },
    },
    {
      authorId: insertedAuthors[0].id,
      title: '口红试色合集 | 黄皮友好色号推荐',
      description: '黄皮女孩的福音来了！精心挑选了10支超适合黄皮的口红色号，从日常到正式场合都有覆盖。包含了豆沙色、珊瑚色、枫叶红等经典显白色系，每一支都经过真人试色验证，绝对不会踩雷。文末还有详细的选色攻略，教你如何根据肤色和场合选择最适合的口红。',
      likes: 11200,
      collects: 4890,
      isTop10: true,
      rawJson: { content: '口红试色内容...', tags: ['口红', '黄皮', '试色'] },
    },
    {
      authorId: insertedAuthors[1].id,
      title: '通勤穿搭 | 职场新人必看',
      description: '刚入职场不知道怎么穿？这份通勤穿搭指南帮你搞定！从正式到商务休闲，从春夏到秋冬，全方位覆盖。',
      likes: 5430,
      collects: 2340,
      isTop10: false,
      rawJson: { content: '通勤穿搭内容...', tags: ['通勤', '职场', '新人'] },
    },
  ]

  await db.insert(notesTable).values(notes)

  return {
    insertedAuthors,
    insertedNotes: notes.length,
  }
}