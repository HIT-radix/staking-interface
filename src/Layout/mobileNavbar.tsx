import NavbarLinks from "Components/navbarLinks";

const MobileNavbar = () => {
  return (
    <div className="flex flex-row items-center text-xl justify-center gap-8 mb-4 md:hidden">
      <NavbarLinks />
    </div>
  );
};

export default MobileNavbar;
