"use client"
import { OrganisationMembersInfo } from "@/app/about/_components/OrganisationMemberInfo"
import { CircleDashed } from "lucide-react"
import { useEffect, useState } from "react"

/*
POSSIBLE IMPROVEMENTS:
amount of layers change dynamically
better way of disabling circles - currently by opacity
*/

export function OrganisationMembersGraphic() {
  const memberRadius = 4
  const layerRadius = 10
  const updateSpeed = 50 //animation speed in milliseconds
  const PgCircleList = (people: number) => {
    const [theta, setTheta] = useState(0)

    let pi_division = 0
    let pi_division2 = 0
    const opacity_constant_pg = 1
    const pg_circles = []
    const pg_layer1 = Math.floor(
      Math.PI / Math.asin(memberRadius / layerRadius)
    ) //amount of circles of radius [memberRadius] that can fit on the circle making up a layer

    //divide pi by people, if divided num too small -> add second layer
    if (people > pg_layer1) {
      pi_division = (2 * Math.PI) / pg_layer1
      pi_division2 = (2 * Math.PI) / (people - pg_layer1)
    } else {
      pi_division = (2 * Math.PI) / people
    }
    //setting up layers
    for (let i = 0; i < Math.min(people, pg_layer1); i++) {
      pg_circles.push({
        name: i,
        cx: 85 + layerRadius * Math.sin(i * pi_division + theta),
        cy: 85 + layerRadius * Math.cos(i * pi_division + theta),
        r: memberRadius,
        opacity: opacity_constant_pg
      })
    }
    for (let i = pg_layer1; i < people; i++) {
      pg_circles.push({
        name: i,
        cx: 85 + 2 * layerRadius * Math.sin(i * pi_division2 - theta),
        cy: 85 + 2 * layerRadius * Math.cos(i * pi_division2 - theta),
        r: memberRadius,
        opacity: opacity_constant_pg
      })
    }
    //animating the circles
    useEffect(() => {
      const updateTheta = () => {
        setTheta(prevTheta => (prevTheta + 0.002) % (2 * Math.PI))
      }

      const interval = setInterval(updateTheta, updateSpeed)

      return () => clearInterval(interval)
    }, [])

    return pg_circles
  }

  const OtCircleList = (people: number) => {
    const [theta, setTheta] = useState(0)

    let pi_division = 0
    let pi_division2 = 0
    let pi_division3 = 0
    const opacity_constant_ot = 1
    const ot_circles = []
    //amount of circles of radius [memberRadius] that can fit on the circle making up a layer
    const ot_layer1 = Math.floor(
      Math.PI / Math.asin(memberRadius / (3 * layerRadius))
    )
    const ot_layer2 = Math.floor(
      Math.PI / Math.asin(memberRadius / (4 * layerRadius))
    )

    //divide pi by people, if divided num too small -> add layers
    if (people > ot_layer1 + ot_layer2) {
      pi_division = (2 * Math.PI) / ot_layer1
      pi_division2 = (2 * Math.PI) / ot_layer2
      pi_division3 = (2 * Math.PI) / (people - ot_layer1 - ot_layer2)
    } else if (people > ot_layer1) {
      pi_division = (2 * Math.PI) / ot_layer1
      pi_division2 = (2 * Math.PI) / (people - ot_layer1)
    } else {
      pi_division = (2 * Math.PI) / people
    }

    //setting up layers
    for (let i = 0; i < Math.min(people, ot_layer1); i++) {
      ot_circles.push({
        name: i,
        cx: 85 + 3 * layerRadius * Math.sin(i * pi_division + theta),
        cy: 85 + 3 * layerRadius * Math.cos(i * pi_division + theta),
        r: memberRadius,
        opacity: opacity_constant_ot
      })
    }
    for (let i = ot_layer1; i < ot_layer1 + ot_layer2; i++) {
      ot_circles.push({
        name: i,
        cx: 85 + 4 * layerRadius * Math.sin(i * pi_division2 - theta),
        cy: 85 + 4 * layerRadius * Math.cos(i * pi_division2 - theta),
        r: memberRadius,
        opacity: opacity_constant_ot
      })
    }
    for (let i = ot_layer1 + ot_layer2; i < people; i++) {
      ot_circles.push({
        name: i,
        cx: 85 + 5 * layerRadius * Math.sin(i * pi_division3 + theta),
        cy: 85 + 5 * layerRadius * Math.cos(i * pi_division3 + theta),
        r: memberRadius,
        opacity: opacity_constant_ot
      })
    }
    //animating the circles
    useEffect(() => {
      const updateTheta = () => {
        setTheta(prevTheta => (prevTheta + 0.0015) % (2 * Math.PI))
      }

      const interval = setInterval(updateTheta, updateSpeed)

      return () => clearInterval(interval)
    }, [])

    return ot_circles
  }

  const HostCircleList = (people: number) => {
    const [theta, setTheta] = useState(0)

    let pi_division = 0
    let pi_division2 = 0
    let pi_division3 = 0
    const opacity_constant_host = 1
    const host_circles = []
    //amount of circles of radius [memberRadius] that can fit on the circle making up a layer
    const host_layer1 = Math.floor(
      Math.PI / Math.asin(memberRadius / (6 * layerRadius))
    )
    const host_layer2 = Math.floor(
      Math.PI / Math.asin(memberRadius / (7 * layerRadius))
    )

    //divide pi by people, if divided num too small -> add layers
    if (people > host_layer1 + host_layer2) {
      pi_division = (2 * Math.PI) / host_layer1
      pi_division2 = (2 * Math.PI) / host_layer2
      pi_division3 = (2 * Math.PI) / (people - host_layer1 - host_layer2)
    } else if (people > host_layer1) {
      pi_division = (2 * Math.PI) / host_layer1
      pi_division2 = (2 * Math.PI) / (people - host_layer1)
    } else {
      pi_division = (2 * Math.PI) / people
    }

    //setting up layers
    for (let i = 0; i < Math.min(people, host_layer1); i++) {
      host_circles.push({
        name: i,
        cx: 85 + 6 * layerRadius * Math.sin(i * pi_division - theta),
        cy: 85 + 6 * layerRadius * Math.cos(i * pi_division - theta),
        r: memberRadius,
        opacity: opacity_constant_host
      })
    }
    for (let i = host_layer1; i < host_layer1 + host_layer2; i++) {
      host_circles.push({
        name: i,
        cx: 85 + 7 * layerRadius * Math.sin(i * pi_division2 + theta),
        cy: 85 + 7 * layerRadius * Math.cos(i * pi_division2 + theta),
        r: memberRadius,
        opacity: opacity_constant_host
      })
    }
    for (let i = host_layer1 + host_layer2; i < people; i++) {
      host_circles.push({
        name: i,
        cx: 85 + 8 * layerRadius * Math.sin(i * pi_division3 - theta),
        cy: 85 + 8 * layerRadius * Math.cos(i * pi_division3 - theta),
        r: memberRadius,
        opacity: opacity_constant_host
      })
    }
    //animating the circles
    useEffect(() => {
      const updateTheta = () => {
        setTheta(prevTheta => (prevTheta + 0.001) % (2 * Math.PI))
      }

      const interval = setInterval(updateTheta, updateSpeed)

      return () => clearInterval(interval)
    }, [])

    return host_circles
  }

  const pgCircles = PgCircleList(20).map(circle => {
    return (
      <circle
        key={circle.name}
        fill="red"
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        opacity={circle.opacity}
      />
    )
  })

  const otCircles = OtCircleList(80).map(circle => {
    return (
      <circle
        key={circle.name}
        fill="rgb(0 215 144)"
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        opacity={circle.opacity}
      />
    )
  })

  const hostCircles = HostCircleList(120).map(circle => {
    return (
      <circle
        key={circle.name}
        fill="rgb(0 100 70)"
        cx={circle.cx}
        cy={circle.cy}
        r={circle.r}
        opacity={circle.opacity}
      />
    )
  })

  return (
    <figure className="relative mt-8 mb-4 w-9/12 object-scale-down">
      <svg viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg">
        <circle fill="orange" cx="85" cy="85" r={memberRadius} opacity={1} />
        {pgCircles}
        {otCircles}
        {hostCircles}
      </svg>
      <figcaption className="bottom-0 opacity-90 md:absolute">
        <OrganisationMembersInfo title="Infographics guide">
          Each year, more than 200 students join Armada to make the fair happen!
          Every circle in the graphic represents one of our members, and the
          color their ranks.
          <ul>
            <li>
              <CircleDashed
                size={20}
                className="mr-1 inline-block text-green-700"
              />
              Hosts
            </li>
            <li>
              <CircleDashed
                size={20}
                className="mr-1 inline-block text-green-300"
              />
              Operation team
            </li>
            <li>
              <CircleDashed
                size={20}
                className="mr-1 inline-block text-red-500"
              />
              Project group
            </li>
            <li>
              <CircleDashed
                size={20}
                className="mr-1 inline-block text-orange-400"
              />
              Project manager
            </li>
          </ul>
        </OrganisationMembersInfo>
      </figcaption>
    </figure>
  )
}
