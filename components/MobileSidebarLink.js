import { useRouter } from "next/router";

function SidebarLink({ Icon, text, active }) {
  const router = useRouter();
  return (
    <div
      className={`text-[#d9d9d9]  p-3 hoverAnimation ${active && "font-bold"}`}
      onClick={() => active && router.push("/")}
    >
      <Icon className="h-7" />
      <span className="">{text}</span>
    </div>
  );
}

export default SidebarLink;
