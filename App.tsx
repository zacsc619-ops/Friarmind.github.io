import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronUp,
  MessageCircle,
  Plus,
  ShieldAlert,
  Search,
  Filter,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";

// --- Utility helpers ---
const TAGS = [
  "#Stress",
  "#Classes",
  "#Relationships",
  "#Athletes",
  "#Sleep",
  "#ProvidenceLife",
  "#Gratitude",
  "#Resources",
];

const LOCATIONS = ["PC Campus (Geofence Mock)", "Providence City (Geofence Mock)"] as const;

const CRISIS_TERMS = [
  "suicide",
  "kill myself",
  "hurt myself",
  "overdose",
  "end it",
  "can't go on",
  "self-harm",
  "cutting",
];

const BANNED_TERMS = ["doxx", "address is", "phone is", "hate", "slur", "kys"]; // minimal demo list

function randomHandle() {
  const animals = [
    "Otter",
    "Hawk",
    "Panda",
    "Fox",
    "Lynx",
    "Bison",
    "Heron",
    "Coyote",
    "Seal",
    "Sparrow",
  ];
  const colors = ["Teal", "Indigo", "Amber", "Rose", "Emerald", "Violet", "Slate", "Cyan"];
  return `${colors[Math.floor(Math.random() * colors.length)]}${
    animals[Math.floor(Math.random() * animals.length)]
  }`;
}

function containsAny(text: string, list: string[]) {
  const lower = text.toLowerCase();
  return list.some((t) => lower.includes(t));
}

// --- Types ---
interface Comment {
  id: string;
  text: string;
  createdAt: number;
}

interface Post {
  id: string;
  handle: string;
  text: string;
  tag?: string;
  votes: number;
  createdAt: number;
  comments: Comment[];
  location: (typeof LOCATIONS)[number];
}

// --- Seed data ---
const seedPosts: Post[] = [
  {
    id: "1",
    handle: "TealOtter",
    text: "First midterms hitting hard. Anyone else juggling DWC and FIN 113? Tips for staying sane?",
    tag: "#Stress",
    votes: 12,
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    comments: [
      {
        id: "c1",
        text: "Block 50-minute focus + 10 min walk. Helps a ton.",
        createdAt: Date.now() - 1000 * 60 * 90,
      },
    ],
    location: "PC Campus (Geofence Mock)",
  },
  {
    id: "2",
    handle: "IndigoFox",
    text: "Shoutout to anyone taking a mental health walk on the Riverwalk tonight. DM-less solidarity 😊",
    tag: "#ProvidenceLife",
    votes: 7,
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    comments: [],
    location: "Providence City (Geofence Mock)",
  },
  {
    id: "3",
    handle: "AmberHeron",
    text: "Athletes—how do you balance lift + practice + sleep? My brain's cooked by 10pm.",
    tag: "#Athletes",
    votes: 5,
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    comments: [
      {
        id: "c2",
        text: "Coach let us nap slots post-lift. Ask for it!",
        createdAt: Date.now() - 1000 * 60 * 60 * 10,
      },
    ],
    location: "PC Campus (Geofence Mock)",
  },
];

export default function App() {
  const [posts, setPosts] = useState<Post[]>(seedPosts);
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [text, setText] = useState("");
  const [tag, setTag] = useState<string | undefined>();
  const [loc, setLoc] = useState<(typeof LOCATIONS)[number]>(LOCATIONS[0]);
  const [crisisDetected, setCrisisDetected] = useState<string | null>(null);
  const [modWarning, setModWarning] = useState<string | null>(null);

  useEffect(() => {
    if (!text) {
      setCrisisDetected(null);
      setModWarning(null);
      return;
    }
    if (containsAny(text, CRISIS_TERMS)) {
      setCrisisDetected(
        "If you're in immediate distress, please reach out: 988 (24/7), PC After-Hours Counseling (press 2), or 911. You matter."
      );
    } else {
      setCrisisDetected(null);
    }
    if (containsAny(text, BANNED_TERMS)) {
      setModWarning("Please avoid sharing personal info or harmful language. Let's keep this space safe.");
    } else {
      setModWarning(null);
    }
  }, [text]);

  const filtered = useMemo(() => {
    return posts
      .filter((p) => (selectedTag ? p.tag === selectedTag : true))
      .filter((p) =>
        query.trim()
          ? [p.text, p.handle, p.tag, p.location].join(" ").toLowerCase().includes(query.toLowerCase())
          : true
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [posts, query, selectedTag]);

  const addPost = () => {
    const t = text.trim();
    if (!t) return;
    if (modWarning) return;
    const newPost: Post = {
      id: Math.random().toString(36).slice(2),
      handle: randomHandle(),
      text: t,
      tag: tag || undefined,
      votes: 0,
      createdAt: Date.now(),
      comments: [],
      location: loc,
    };
    setPosts([newPost, ...posts]);
    setText("");
    setTag(undefined);
    setComposerOpen(false);
  };

  const upvote = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, votes: p.votes + 1 } : p)));
  };

  const addComment = (id: string, comment: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: Math.random().toString(36).slice(2), text: comment, createdAt: Date.now() },
              ],
            }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-center p-4 font-bold text-xl">Providence Support</h1>
    </div>
  );
}
