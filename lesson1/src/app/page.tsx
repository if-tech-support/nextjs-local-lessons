const SERVICE_SECTION_CONTENTS = [
  {
    id: 1,
    title: '1. ウェブ開発',
    description: 'カスタムウェブサイトの開発、eコマースソリューション',
  },
  {
    id: 2,
    title: '2. モバイルアプリ開発',
    description: 'iOSおよびAndroid向けの革新的なモバイルアプリケーション',
  },
  {
    id: 3,
    title: '3. UI/UXデザイン',
    description: 'ユーザー中心のデザインで、最適なユーザーエクスペリエンスを提供',
  },
  {
    id: 4,
    title: '4. デジタルマーケティング',
    description: 'SEO、ソーシャルメディアマーケティング、コンテンツ戦略によるブランドのオンラインプレゼンスの強化',
  },
];

const NEWS_CONTENTS = [
  {
    id: 1,
    date: '2023/4/10',
    description: '環境に配慮したウェブホスティングサービスの提供を開始',
  },
  {
    id: 2,
    date: '2023/6/20',
    description: '新オフィス開設に伴い、東京都内での採用を強化',
  },
  {
    id: 3,
    date: '2023/9/15',
    description: '当社のモバイルアプリ開発チームが、国際デザイン賞を受賞',
  },
  {
    id: 4,
    date: '2023/11/30',
    description: 'Web World Creators株式会社、AIを活用したウェブアナリティクスツールをリリース',
  },
];

export default function Top() {
  return (
    <>
      <div className="h-[300px] bg-center bg-cover rounded bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1770&auto=format&fit=crop')]" />
      <div className="mx-auto my-4 max-w-[960px] px-4">
        <div className="flex flex-col gap-4 mx-auto mb-16">
          <h2 className="text-xl font-bold text-blue-700 border-b">MISSION</h2>
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <p className="text-lg font-bold mb-4">「デジタルイノベーションを通じて、未来のビジネスを創造する」</p>
              <p>
                Web World
                Creators株式会社は、最先端のウェブ技術と創造的なデザインを融合させ、クライアントのビジネスが直面する課題を解決します。私たちは、持続可能で効果的なデジタルソリューションを提供することにより、クライアントのビジネス成長を加速させることを使命としています。
              </p>
            </div>
            <div className="w-1/2 bg-center bg-cover rounded bg-[url('https://cdn.pixabay.com/photo/2015/01/09/11/09/meeting-594091_1280.jpg')]" />
          </div>
        </div>
        <div className="flex flex-col gap-4 mx-auto mb-16">
          <h2 className="text-xl font-bold text-blue-700 border-b">SERVICE</h2>
          <div className="flex flex-wrap gap-6 w-full">
            {SERVICE_SECTION_CONTENTS.map((content) => (
              <div key={content.id} className="w-[46%] p-4 bg-blue-50 rounded shadow">
                <p className="text-base font-bold text-center">{content.title}</p>
                <p>{content.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 mx-auto mb-16">
          <h2 className="text-xl font-bold text-blue-700 border-b">NEWS</h2>
          <div>
            {NEWS_CONTENTS.map((news) => (
              <div key={news.id} className="flex justify-between py-5 border-b border-blue-100">
                <p>{news.date}</p>
                <p className="w-3/5">{news.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
