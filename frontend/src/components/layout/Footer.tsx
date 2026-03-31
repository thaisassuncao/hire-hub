export default function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "16px 24px",
        borderTop: "1px solid #e5e5e5",
        marginTop: "auto",
      }}
    >
      <p>Hire Hub &copy; {new Date().getFullYear()}</p>
    </footer>
  );
}
