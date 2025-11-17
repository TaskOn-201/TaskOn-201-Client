import Image from "next/image";

const Header = () => {
    return (
        <header className="w-full h-20 flex justify-between py-4 px-5 border-b border-gray-200 bg-white">
            <div className="cursor-pointer">
                <Image src="/logo.png" alt="TaskOn logo" width={120} height={50} />
            </div>
            <div className="flex gap-3 py-2 cursor-pointer">
                {/* 사용자 프로필 */}
                <div className="w-8 h-8 rounded-2xl bg-gray-200"></div>
                <span className="flex flex-col justify-center text-main2">사용자1</span>
            </div>
        </header>
    );
};

export default Header;
