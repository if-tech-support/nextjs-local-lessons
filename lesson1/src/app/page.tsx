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
      <div className="h-[400px] bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center mb-[100px]"></div>
      <div className="mx-auto my-4 max-w-[960px] px-4 max-[768px]:px-2">
        <div className="flex flex-col gap-4 mx-auto mb-[100px]">
          <h2 className="text-[24px] font-bold text-[#1d5396] mb-4 border-b border-[#1d5396] inline-block mx-auto">
            MISSION
          </h2>
          <div className="flex flex-row justify-between gap-4 w-full max-[768px]:flex-col-reverse">
            <div className="w-[48%] max-[768px]:w-full">
              <p className="text-[20px] font-bold mb-4">「デジタルイノベーションを通じて、未来のビジネスを創造する」</p>
              <p>
                Web World
                Creators株式会社は、最先端のウェブ技術と創造的なデザインを融合させ、クライアントのビジネスが直面する課題を解決します。私たちは、持続可能で効果的なデジタルソリューションを提供することにより、クライアントのビジネス成長を加速させることを使命としています。
              </p>
            </div>
            <div className="w-[48%] max-[768px]:w-full max-[768px]:h-[300px] bg-[url('https://cdn.pixabay.com/photo/2015/01/09/11/09/meeting-594091_1280.jpg')] bg-cover max-[768px]:mb-4"></div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mx-auto mb-[100px]">
          <h2 className="text-[24px] font-bold text-[#1d5396] mb-4 border-b border-[#1d5396] inline-block mx-auto">
            SERVICE
          </h2>
          <div className="flex flex-wrap justify-between max-[768px]:justify-center gap-8 w-full">
            {SERVICE_SECTION_CONTENTS.map((content) => (
              <div
                key={content.id}
                className="flex flex-col gap-4 w-[46%] max-[768px]:w-full h-auto p-4 bg-[aliceblue] rounded-lg"
              >
                <p className="text-[18px] font-bold text-center">{content.title}</p>
                <p>{content.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 mx-auto mb-[100px]">
          <h2 className="text-[24px] font-bold text-[#1d5396] mb-4 border-b border-[#1d5396] inline-block mx-auto">
            NEWS
          </h2>
          <div>
            {NEWS_CONTENTS.map((news) => (
              <div key={news.id} className="flex justify-between py-5 border-b border-[#e6e6fa]">
                <p>{news.date}</p>
                <p className="w-[60%]">{news.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
