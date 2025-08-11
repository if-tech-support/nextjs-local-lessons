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
    <div className="mx-auto max-w-[960px] px-4 max-[768px]:px-2">
      <h2 className="text-[32px] font-bold text-[#1d5396] px-4 py-8">COMPANY</h2>
      <div className="flex flex-col items-center justify-center w-full px-4 py-8 rounded-lg bg-white">
        {COMPANY_PROFILES.map((data) => (
          <div key={data.id} className="flex w-full py-5 border-b border-[#e6e6fa]">
            <p className="w-[200px] text-[18px]">{data.title}</p>
            <p>{data.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
