const Footer = () => {
  const year = new Date().getFullYear();
  return <div className="mt-auto py-8 text-center">&copy; {year} Just Beat It | All Rights Reserved</div>;
};

export default Footer;
