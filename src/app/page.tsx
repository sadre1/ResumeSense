import { Button } from "@/components/ui/button";
import Link from "next/link";
import ShinyText from '@/components/react-bits/ShinyText';
import GlobalBackground from "@/components/GlobalBackground";
import SplitText from "@/components/react-bits/SplitText";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <GlobalBackground />
      <div className="max-w-prose space-y-3">
        {/* <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className=" mx-auto md:ms-0"
        /> */}
                <ShinyText
          text="✨ Create the Perfect Resume in Minutes ✨"
          speed={2}
          delay={0}
          color="#ffff"
          shineColor="#000000"
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-3xl font-bold"
        />
        <SplitText
        text="Our AI resume builder helps you
          design a professional resume, even if you&apos;re not very smart."
        className="text-2xl font-semibold text-center"
        delay={50}
        duration={1.25}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
      />
        <p className="text-lg text-gray-500">
          
        </p>

        <div className="flex">
        <Button asChild size="lg"  className="mx-auto md:ms-0 text-black bg-white rounded-4xl hover:bg-gray-100">
          <Link href="/resumes">Build Your Resume</Link>
        </Button>
         <Button asChild size="lg"  className="mx-auto md:ms-0 rounded-4xl" >
          <Link href="/resumes">Check Resume Score</Link>
        </Button>
        </div>

      </div>
{/* <MotionWrapper>
  <Image
    src={resumePreview}
    alt="Resume preview"
    width={600}
    className="shadow-md lg:rotate-[1.5deg]"
  />
  </MotionWrapper> */}

    </main>
  );
}