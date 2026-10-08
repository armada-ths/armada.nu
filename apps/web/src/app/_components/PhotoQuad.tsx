import Image from "next/image"

export function PhotoQuad(props: {
  photoSrc: { source: string; altText: string }[]
}) {
  const imageList = props.photoSrc.map((imgDetails, index) => (
    <Image
      key={index}
      src={imgDetails.source}
      alt={imgDetails.altText}
      width={500}
      height={500}
      className="mb-4 aspect-square object-cover transition-all duration-200 hover:scale-105 md:w-1/4 md:p-1"
      style={{
        maxWidth: "48%",
        height: "auto"
      }}
    />
  ))

  return <div className="mt-8 flex flex-wrap justify-between">{imageList}</div>
}
