import { StatusModuleItem } from "@/app/(frontend)/exhibitor/_components/StatusModuleItem"
import { fetchDates } from "@/components/shared/hooks/api/useDates"
import Link from "next/link"

//ASSUMPTION: the start date will be first for fair dates
export async function CurrentStatus() {
  const dates = await fetchDates()
  const today = Date.now() //.toISOString();

  if (today < new Date(dates.ir.start).getTime()) {
    return (
      <StatusModuleItem title="Registration is opening soon!">
        We are preparing the registration for next year&apos;s Armada.{/*  In the
        meanwhile, you are very welcome to report interest in this{" "}
        <Link
          className="text-white underline hover:no-underline"
          href="https://docs.google.com/forms/d/e/1FAIpQLSdny1mhsj1Wutt_FaJtqgxKJP3OOBrWW09Ic3T5_NwEHWhV_w/viewform?usp=sf_link">
          form
        </Link>{" "}
        and we will get back to you once registration is open! */}
      </StatusModuleItem>
    )
  } else if (
    today > new Date(dates.ir.start).getTime() &&
    today < new Date(dates.ir.end).getTime()
  ) {
    return (
      <StatusModuleItem title="Priority Registration open">
        We are currently preparing the registration for Armada {new Date().getFullYear()}. In the
        meantime, feel free to express your interest. During the Priority
        Registration, you can apply to become an exhibitor at Armada. By doing
        so, you do not commit to participating, yet you'll be eligible for a
        priority discount. Learn more about each stage here.{" "}
        <Link
          className="text-white underline hover:no-underline"
          href="/exhibitor/timeline">
          here.
        </Link>{" "}
      </StatusModuleItem>
    )
  } else if (
    today > new Date(dates.ir.end).getTime() &&
    today < new Date(dates.fr.start).getTime()
  ) {
    return (
      <StatusModuleItem title="Registration Period is over">
        Registration is over for now, but there might be spots left. Please{" "}
        <Link
          className="text-white underline hover:no-underline"
          href="mailto:sales@armada.nu">
          contact sales
        </Link>{" "}
        if you are interested!
      </StatusModuleItem>
    )
  } else if (
    today > new Date(dates.fr.start).getTime() &&
    today < new Date(dates.fr.end).getTime()
  ) {
    return (
      <StatusModuleItem title="Standard registration is open">
        In the Standard registration you choose your package and finalize your
        order. Once that is done it is time to prepare the practicalities of
        exhibiting. All of this is done on the Armada registration dashboard.
        Read more about how registration works{" "}
        <Link
          className="text-white underline hover:no-underline"
          href="/exhibitor/timeline">
          here
        </Link>
        if you are interested!
      </StatusModuleItem>
    )
  }

  //default
  return <div></div>
}
