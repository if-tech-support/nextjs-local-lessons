const COMPANY_PROFILES = [
  {
    id: 1,
    title: '設立',
    content: '2020年',
  },
  {
    id: 2,
    title: '本社所在地',
    content: '東京都',
  },
  {
    id: 3,
    title: '代表取締役',
    content: '山田太郎',
  },
  {
    id: 4,
    title: '従業員数',
    content: '50人',
  },
  {
    id: 5,
    title: '主要取引先',
    content: 'スタートアップ企業、中堅企業、大企業',
  },
];

export default function Company() {
  return (
    <div className="mx-auto max-w-[960px] px-4">
      <h2 className="text-2xl font-bold text-blue-700 py-8">COMPANY</h2>
    <div className="space-y-4 py-4">
        {COMPANY_PROFILES.map((data) => (
      <div key={data.id} className="flex py-4 border-b border-blue-100">
            <p className="w-[200px] text-base">{data.title}</p>
            <p>{data.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
