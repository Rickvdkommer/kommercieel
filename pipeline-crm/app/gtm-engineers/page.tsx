import Script from "next/script";

export const metadata = {
  title: "GTM Engineers",
};

export default function GTMEngineersPage() {
  return (
    <>
      <Script
        src="https://tally.so/widgets/embed.js"
        strategy="afterInteractive"
      />
      <div className="fixed inset-0">
        <iframe
          data-tally-src="https://tally.so/r/zxKAYZ?transparentBackground=1"
          width="100%"
          height="100%"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title="GTM Engineers"
        />
      </div>
    </>
  );
}
