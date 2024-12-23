"use client"
import axios from "axios";
import Tag from "./tag";
import {useRouter} from "next/navigation";
import {useState} from "react";

interface EventCardProps {
  _id: string,
  poster: string,
  heading: string,
  eventHostedBy: string,
  description: string,
  tags: string[],
  eventTime: Date,
  eventVenue: string,
  isInterested: boolean,
}

export default function EventCard({_id, poster, heading, eventHostedBy, description, tags, eventTime, eventVenue, isInterested,}: EventCardProps) {
  const [interested, setInterested] = useState(isInterested);
  async function handleInterested() {
    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/events/interested/${_id}`);
      if (res.status === 200) {
        console.log("Interest status updated");
        // Update local interestedArr state or trigger a re-fetch
        setInterested(!interested);
      }
    } catch (error) {
      console.log("Error updating interest status:", error);
    }
  }

  const router = useRouter();
  return (
    <>
      <div
        className="flex flex-col md:flex-row w-full md:w-3/5 h-auto md:h-64 mt-8 border-2 rounded-xl border-cyan-300 shadow-md shadow-cyan-300/50"
      >
        {/* Image Section */}
        <img
          src={poster}
          alt=""
          className="h-48 md:h-64 w-full md:w-1/3 object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none overflow-hidden"
        />

        {/* Content Section */}
        <div className="flex flex-col p-4 md:ml-4 w-full md:w-2/3 h-full">
          {/* Heading and Host */}
          <div className="flex flex-col md:flex-row justify-between w-full items-center">
            <div
              className="text-xl md:text-2xl font-bold cursor-pointer"
              onClick={() => router.push(`/events/${_id}`)}
            >
              {heading}
            </div>
            <div className="text-lg md:text-2xl font-bold mt-2 md:mt-0 mr-0 md:mr-4">
              {eventHostedBy}
            </div>
          </div>

          {/* Description */}
          <div className="w-full mt-2 md:mt-4 h-auto md:h-2/5 pl-2 text-sm md:text-base">
            {description}
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap items-center w-full mt-4 md:mt-2 h-auto md:h-1/5 font-bold">
            <div className="text-lg font-bold mr-2">Tags:</div>
            {tags.map((tag) => (
              <Tag tag={tag} key={tag}/>
            ))}
          </div>

          {/* Time, Venue, and Button */}
          <div className="flex flex-col md:flex-row justify-between items-center w-full mt-4 md:mt-2 h-auto md:h-1/5">
            {/* Time and Venue */}
            <div className="flex flex-col w-full md:w-2/3">
              <div className="font-bold text-sm md:text-base">
                Time: <span className="ml-3">{new Date(eventTime).toLocaleString()}</span>
              </div>
              <div className="font-bold text-sm md:text-base mt-1">
                Venue: <span className="ml-3">{eventVenue}</span>
              </div>
            </div>

            {/* Interested Button */}
            <button
              className={`text-sm md:text-lg font-bold h-10 md:h-3/5 ${
                isInterested
                  ? "bg-red-600"
                  : "bg-gradient-to-br from-cyan-600 to-cyan-400"
              } text-white w-full md:w-1/3 rounded-3xl mt-4 md:mt-0 md:mr-4`}
              onClick={handleInterested}
            >
              {isInterested ? "Interested" : "Not Interested"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
