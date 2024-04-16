const Footer = () => {
  return <div>Footer</div>;
};

export default Footer;
// import { FunctionComponent } from "react";

// import XLogo from "Assets/Svgs/x.svg";
// import TelegramLogo from "Assets/Svgs/telegram.svg";
// import MailLogo from "Assets/Svgs/mail.svg";
// import GitbookLogo from "Assets/Svgs/gitbook.svg";
// import RadiyumLogo from "Assets/Svgs/radiyum.svg";
// import MeshWhite from "Assets/Svgs/mesh-white.svg";
// import { EMAIL, GITBOOK, MESH_WEBSITE, RADIYUM_URL, TELEGRAM_LINK, X_HANDLE } from "Constants/misc";
// import { useSelector } from "Store";

// const Footer: FunctionComponent = () => {
//   const { proMode } = useSelector((state) => state.session);
//   return (
//     <div className="relative bottom-10 md:bottom-0 w-full p-2 mt-2">
//       <div
//         className={`hidden md:flex flex-col justify-center items-center mb-8 ${
//           proMode ? "w-full md:hidden" : "w-full"
//         }`}
//       >
//         <div className="text-primary mb-2 font-bold">
//           Get <span className="mesh-text-gradient font-bold">$MESH</span>
//         </div>
//         <div className="flex flex-row justify-center gap-3">
//           <a href={RADIYUM_URL} target="blank">
//             <img src={RadiyumLogo} alt="mexc-logo" />
//           </a>
//           {/* <a href={ORCA_URL} target="blank">
//             <ORCA />
//           </a> */}
//           {/* <a href={MEXC_URL} target="blank">
//             <img src={MEXCLogo} alt="mexc-logo" />
//           </a> */}
//         </div>
//       </div>
//       <div className="flex justify-center md:justify-end p-0 lg:px-8 w-[97vw]">
//         <div className="flex flex-row justify-evenly md:justify-between items-center w-1/2 lg:w-1/6 px-1 md:px-2 py-4">
//           <a href={TELEGRAM_LINK} target="blank" className="cursor-pointer">
//             <img src={TelegramLogo} width={20} height={20} alt="telegram-icon" />
//           </a>
//           <a href={`mailto:${EMAIL}`} target="blank" className="cursor-pointer">
//             <img src={MailLogo} width={20} height={20} alt="mail-icon" />
//           </a>
//           <a href={X_HANDLE} target="blank" className="cursor-pointer">
//             <img src={XLogo} width={20} height={20} alt="x-icon" />
//           </a>
//           <a href={MESH_WEBSITE} target="blank" className="cursor-pointer">
//             <img src={MeshWhite} width={30} height={30} alt="mesh" />
//           </a>
//           <a href={GITBOOK} target="blank" className="cursor-pointer">
//             <img src={GitbookLogo} width={22} height={22} alt="gitbook-icon" />
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;
