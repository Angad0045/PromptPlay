import { Container } from "../component/Container";

const shimmerKeyframes = `
  @keyframes shimmer {
    0% { background-position: -800px 0; }
    100% { background-position: 800px 0; }
  }
`;

const shimmerStyle = {
  background: "linear-gradient(90deg, #1a1a2e 25%, #2a2a4a 50%, #1a1a2e 75%)",
  backgroundSize: "800px 100%",
  animation: "shimmer 1.6s infinite linear",
};

function HomePageShimmer() {
  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div className="w-full flex flex-col">
        {/* ── Hero Banner shimmer ── */}
        <div className="relative w-full h-150" style={shimmerStyle}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        </div>

        {/* ── Trending row shimmer ── */}
        <div
          className="flex items-center -mt-50 md:ml-5 lg:ml-20 xl:ml-40 mb-5 md:mb-10 gap-5 overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, black 80%, transparent 100%)",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="relative flex-shrink-0 flex items-end">
              <div
                className="h-60 w-40 rounded-lg ml-20 z-20"
                style={shimmerStyle}
              />
            </div>
          ))}
        </div>

        {/* ── Movie grid shimmer ── */}
        <Container>
          <div className="gap-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full px-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-md"
                style={{ ...shimmerStyle, aspectRatio: "2/3" }}
              />
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}

export default HomePageShimmer;
