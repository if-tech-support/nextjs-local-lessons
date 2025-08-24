import Image from "next/image";
import { notFound } from "next/navigation";
import { User } from "@/types/user";
import BackButton from "./BackButton";

// 特定のユーザデータを取得する関数
async function getUser(id: string): Promise<User> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

interface UserDetailPageProps {
  params: {
    id: string;
  };
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  try {
    const user = await getUser(params.id);

    return (
      <div>
        <div className="mb-6">
          <BackButton />
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-800">ユーザ詳細</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={`https://robohash.org/${user.id}`}
                alt={`${user.username}のアバター`}
                fill
                className="object-cover"
                sizes="128px"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {user.username}
              </h2>
              <p className="text-gray-600">{user.name}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-700 mb-2">連絡先情報</h3>
              <p className="text-gray-600">
                <span className="font-medium">メール:</span> {user.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">電話:</span> {user.phone}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">ウェブサイト:</span>{" "}
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {user.website}
                </a>
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-700 mb-2">会社情報</h3>
              <p className="text-gray-600">
                <span className="font-medium">会社名:</span> {user.company.name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">キャッチフレーズ:</span>{" "}
                {user.company.catchPhrase}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">住所</h3>
              <p className="text-gray-600">
                {user.address.street}, {user.address.suite}
              </p>
              <p className="text-gray-600">
                {user.address.city}, {user.address.zipcode}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
