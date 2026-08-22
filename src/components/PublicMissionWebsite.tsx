import React, { useState, useEffect } from 'react';
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Sun,
  Globe,
  Users,
  Compass,
  ArrowRight,
  HandHeart,
  Scale,
  Flame,
  Volume2,
  VolumeX,
  Share2,
  Check,
  Copy,
  BookOpen,
  MessageCircle,
  HelpCircle,
  Award,
  Send,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  HeartHandshake,
  Lightbulb,
  Smile,
  Zap,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Archive
} from 'lucide-react';
import { HumanLogo, HumanInitiativeLogo } from './HumanLogo';
import { useTheme } from '../context/ThemeContext';

interface PublicMissionWebsiteProps {
  onNavigateToRoadmap?: () => void;
  onNavigateToInitiative?: () => void;
  onNavigateToFund?: () => void;
  onNavigateToCreators?: () => void;
  onNavigateToDevelopers?: () => void;
}

interface Pillar {
  id: 'greed' | 'hate' | 'violence' | 'pain' | 'suffering';
  title: string;
  evilTarget: string;
  tagline: string;
  icon: string;
  color: string;
  bgLight: string;
  borderColor: string;
  theRootProblem: string;
  theHumanSolution: string;
  realWorldImpact: string[];
  everydayStory: string;
}

const PILLARS_DATA: Pillar[] = [
  {
    id: 'greed',
    title: 'Ending Corporate Greed & Manufactured Poverty',
    evilTarget: 'Greed & Monopolistic Hoarding',
    tagline: 'Technology must enrich all human beings, not concentrate trillions into the hands of a few billionaires.',
    icon: 'Scale',
    color: '#3D6E50',
    bgLight: 'bg-[#EBF3ED]',
    borderColor: 'border-[#C9D1BE]',
    theRootProblem: 'Modern economies reward scarcity and monopolistic hoarding. Giant tech corporations extract the creative labor, data, and work of billions of people without sharing the wealth generated, forcing hard-working families into perpetual financial anxiety.',
    theHumanSolution: 'The 50% People’s Covenant. Every commercial software app, AI system, and enterprise tool integrated with The H.U.M.A.N. Initiative automatically deposits 50% of all subscription and usage revenue into an unassailable, non-profit Society Fund distributed directly to real human creators and community living floors.',
    realWorldImpact: [
      'Automatic monthly dividend streams directly to verified human creators and contributors.',
      'A guaranteed baseline living floor that removes the terror of unpaid rent, hunger, and medical debt.',
      'Open, transparent public ledger where every dollar is audited with zero corporate skimming.'
    ],
    everydayStory: 'Imagine waking up knowing your rent is paid and your family is secure, not because of charity, but because you are a recognized stakeholder in the technological wealth of the human race.'
  },
  {
    id: 'hate',
    title: 'Ending Algorithmic Hate, Division & Tribalism',
    evilTarget: 'Hate & Rage-Baiting Systems',
    tagline: 'Replacing algorithms designed to make us hate our neighbors with platforms that foster empathy, truth, and community.',
    icon: 'Heart',
    color: '#D67D5C',
    bgLight: 'bg-[#FDF2EC]',
    borderColor: 'border-[#F5D5C6]',
    theRootProblem: 'Social media algorithms are deliberately tuned for outrage because anger generates clicks and advertising dollars. Families are torn apart, neighbors become enemies, and vulnerable minorities are targeted by weaponized misinformation.',
    theHumanSolution: 'The Empathy-First Initiative. We build and certify technology that measures success by mutual understanding, genuine connection, and verifiable truth—banning toxic engagement loops, deepfake slander, and algorithmic radicalization.',
    realWorldImpact: [
      'Certified C2PA Content Credentials that mathematically prove authentic human creation vs. synthetic deception.',
      'Algorithm-free community commons where constructive dialogue and mutual aid replace outrage cycles.',
      'Protection of children and youth from exploitative, addictive dopamine traps.'
    ],
    everydayStory: 'Imagine digital spaces that leave you feeling calmer, wiser, and more connected to people around the world, rather than angry, isolated, and anxious.'
  },
  {
    id: 'violence',
    title: 'Ending War, Physical Violence & Exploitation',
    evilTarget: 'War, Violence & Destruction',
    tagline: 'Redirecting the trillions spent on weapons of mass destruction into planetary healing, clean energy, and peace.',
    icon: 'ShieldCheck',
    color: '#4B6B94',
    bgLight: 'bg-[#EDF3FA]',
    borderColor: 'border-[#C8DAEA]',
    theRootProblem: 'Over $2.4 trillion is spent globally every year on weapons, militarism, and state-sanctioned violence, while over 700 million people lack clean water and basic nutrition. Conflict is fueled by resource scarcity, territorial greed, and dehumanization.',
    theHumanSolution: 'The Planetary Peace Dividend. As ethical automation collapses the cost of energy, food, clean water, and shelter, we systematically dismantle the economic incentives for war. We forge multilateral covenants dedicating technological abundance to universal survival.',
    realWorldImpact: [
      'Decentralized solar, atmospheric water generation, and vertical farming deployed to high-conflict regions.',
      'Demilitarization incentives tied to automated sovereign equity dividends.',
      'Universal digital protection against cyber-warfare and weaponized AI drone targeting.'
    ],
    everydayStory: 'Imagine a world where no mother has to fear bombs dropping on her children’s school, and no young person is sent to die for corporate oil or mineral concessions.'
  },
  {
    id: 'pain',
    title: 'Ending Preventable Sickness, Physical Pain & Neglect',
    evilTarget: 'Preventable Pain & Medical Injustice',
    tagline: 'Healing, medicine, and mental wellness must be treated as sacred universal birthrights, never commodities.',
    icon: 'HandHeart',
    color: '#8C5A85',
    bgLight: 'bg-[#F9EEF7]',
    borderColor: 'border-[#E6CCE2]',
    theRootProblem: 'Pharmaceutical monopolies price-gouge life-saving medications like insulin and cancer therapies. Millions endure chronic physical and psychological agony simply because they cannot afford private insurance or doctor visits.',
    theHumanSolution: 'Open-Source Healing Commons. We fund decentralized medical research, open-access diagnostic AI, and free mental health sanctuaries. 100% of medical breakthroughs funded through The H.U.M.A.N. Initiative are released patent-free to the entire human species.',
    realWorldImpact: [
      'Zero-cost open diagnostics providing world-class health insights to any smartphone on Earth.',
      'Universal mental health crisis lines and community trauma-healing circles.',
      'Immediate funding priority for eradication of chronic pediatric diseases and rare illnesses.'
    ],
    everydayStory: 'Imagine never having to choose between buying medicine for your child and putting food on the table, or suffering in silence with depression because you cannot afford therapy.'
  },
  {
    id: 'suffering',
    title: 'Ending Despair, Alienation & Human Suffering',
    evilTarget: 'Despair & Loss of Meaning',
    tagline: 'Restoring sacred human purpose, artistic joy, and dignity to every living person on Earth.',
    icon: 'Sparkles',
    color: '#9C7A2E',
    bgLight: 'bg-[#FAF5E6]',
    borderColor: 'border-[#EBD9A7]',
    theRootProblem: 'Modern hyper-capitalism treats human beings as disposable cogs in a machine. People feel burnt out, lonely, and stripped of dignity, wondering why life feels like an endless struggle for survival despite all our advanced technology.',
    theHumanSolution: 'The Human Renaissance. By freeing humanity from the coercion of survival-labor through shared dividends, we liberate human beings to pursue art, philosophy, scientific discovery, community care, music, parenting, and environmental restoration.',
    realWorldImpact: [
      'Unconditional dignity: Every person’s value is recognized as intrinsic, not determined by their net worth.',
      'Revitalization of local arts, music, storytelling, and cultural traditions.',
      'Restoration of the planetary biosphere, oceans, forests, and wildlife habitats.'
    ],
    everydayStory: 'Imagine waking up each morning with the freedom to spend time with your loved ones, create beautiful things, and contribute to your community with a peaceful heart.'
  }
];

const FAQS = [
  {
    q: 'Is this just an idealistic dream, or is there a concrete mathematical plan?',
    a: 'It is a concrete, working economic and technological system. We have already built the live 50% revenue distribution smart contracts, developer SDKs, C2PA cryptographic provenance tracking, and the 7-phase macroeconomic roadmap to scale from individual apps to sovereign global wealth funds.'
  },
  {
    q: 'Who is behind this, and how can I know you won’t get corrupted?',
    a: 'The H.U.M.A.N. Initiative is structured as an immutable, non-profit covenant. The 50% Society Fund is hardcoded on public ledgers with multi-signature public audits. The founders and stewards take zero cut of creator royalties, and all core software is open-source and mathematically governed.'
  },
  {
    q: 'How does the 50% split work in practice?',
    a: 'When an everyday user subscribes to an ethical app (like a writing tool, music creator, or AI assistant), 50% of their subscription fee is automatically escrowed and streamed directly to the human artists, writers, programmers, and communities whose work powers the system. It replaces corporate profit extraction with direct human dividend flows.'
  },
  {
    q: 'What can an ordinary person like me do right now to help?',
    a: 'You can sign the Human Pledge, demand ethical certification from the apps you use, share this mission with three friends, contribute your thoughts to our Community Wall, and choose kindness in your daily interactions.'
  },
  {
    q: 'Does this mean people stop working?',
    a: 'No! It means people stop being forced to work jobs they hate just to avoid starvation. When basic survival is guaranteed, humans naturally work harder on things they care about—teaching, curing diseases, creating art, caring for elders, building local businesses, and exploring the cosmos.'
  }
];

const COMMUNITY_VOICES = [
  {
    name: 'Sarah M.',
    role: 'Mother of Two & Public School Teacher',
    location: 'Ohio, USA',
    quote: 'As a teacher, I see kids coming to school hungry and stressed about their parents’ bills. If technology can automate so much, why aren’t we using it to lift families up? This mission gives me real hope.',
    date: '2 hours ago'
  },
  {
    name: 'Mateo R.',
    role: 'Acoustic Guitarist & Independent Songwriter',
    location: 'Valparaíso, Chile',
    quote: 'For years big streaming apps took 99.9% of the money while artists starved. The 50% Human Covenant is the first time someone looked at artists and treated us like human souls instead of training data.',
    date: '5 hours ago'
  },
  {
    name: 'Dr. Amina K.',
    role: 'Public Health Epidemiologist',
    location: 'Nairobi, Kenya',
    quote: 'Ending preventable pain through open-source medical diagnostics is how we prevent the next epidemic. Health should never be a luxury good.',
    date: '1 day ago'
  },
  {
    name: 'Liam J.',
    role: 'Retired Electrical Lineman & Grandfather',
    location: 'Manchester, UK',
    quote: 'I have seen war, economic crashes, and communities hollowed out by greed. We have the engineering power to feed, heal, and house everyone. We just needed the moral courage to build it.',
    date: '2 days ago'
  }
];

export const PublicMissionWebsite: React.FC<PublicMissionWebsiteProps> = ({
  onNavigateToRoadmap,
  onNavigateToInitiative,
  onNavigateToFund,
  onNavigateToCreators,
  onNavigateToDevelopers
}) => {
  const { mode } = useTheme();
  const isDark = mode === 'dark' || mode === 'oled';

  // State
  const [selectedPillarId, setSelectedPillarId] = useState<string>('greed');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  
  // Interactive Empathy Guide Chat state
  const [chatQuestion, setChatQuestion] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'guide'; text: string; time: string }>>([
    {
      sender: 'guide',
      text: 'Hello, fellow traveler! I am the Human Mission Companion. Ask me anything about how we can end needless suffering, greed, hate, and violence, or how this vision protects you and your loved ones in everyday life.',
      time: 'Just now'
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Pledge state
  const [pledgeName, setPledgeName] = useState<string>('');
  const [pledgeEmail, setPledgeEmail] = useState<string>('');
  const [pledgeCommitment, setPledgeCommitment] = useState<string>('all');
  const [pledgeSigned, setPledgeSigned] = useState<boolean>(() => {
    return localStorage.getItem('human_pledge_signed') === 'true';
  });
  const [pledgeSignerName, setPledgeSignerName] = useState<string>(() => {
    return localStorage.getItem('human_pledge_name') || '';
  });
  const [totalPledgeCount, setTotalPledgeCount] = useState<number>(48291);
  const [copiedPledge, setCopiedPledge] = useState<boolean>(false);

  // Community Wall state
  const [newWallAuthor, setNewWallAuthor] = useState<string>('');
  const [newWallLocation, setNewWallLocation] = useState<string>('');
  const [newWallMessage, setNewWallMessage] = useState<string>('');
  const [wallPosts, setWallPosts] = useState<Array<{ name: string; role: string; location: string; quote: string; date: string }>>(() => {
    const saved = localStorage.getItem('human_community_wall');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return COMMUNITY_VOICES;
      }
    }
    return COMMUNITY_VOICES;
  });
  const [wallSubmitted, setWallSubmitted] = useState<boolean>(false);

  // Life Scenario comparison
  const [activeScenario, setActiveScenario] = useState<'health' | 'housing' | 'work' | 'art' | 'peace'>('housing');

  // Selected Pillar
  const activePillar = PILLARS_DATA.find((p) => p.id === selectedPillarId) || PILLARS_DATA[0];

  // Speech synthesis simulation / Web Speech API
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `The Human Mission Manifesto. We believe that no human being was born to suffer in poverty, fear, violence, or despair while a handful of billionaires hoard trillions. We are on a mission to end needless hate, pain, violence, corporate greed, and human suffering. By uniting ethical technology with the 50% People’s Covenant, we redirect technological abundance to heal the sick, feed the hungry, house the vulnerable, and restore dignity to every living human soul.`;
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      utterance.onstart = () => {
        setIsPlayingAudio(true);
      };
      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 8000);
    }
  };

  // Chat Guide submit
  const handleSendChatQuestion = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatQuestion.trim() || isChatLoading) return;

    const userText = chatQuestion.trim();
    setChatQuestion('');
    const userMsg = {
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      // Call server Gemini API or helpful empathetic fallback
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `The user is an everyday person asking about The H.U.M.A.N. Initiative's mission to stop needless hate, pain, violence, greed, and suffering in the world. Answer with deep warmth, radical empathy, plain jargon-free English, and genuine hope. Keep your answer concise (2-3 short paragraphs maximum). Ground it in the 50% People's Covenant, universal human dignity, and practical steps. User question: "${userText}"`
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply || data.text || "Thank you for asking this essential question. At its core, the mission is simple: we believe that every human being deserves food, clean shelter, healthcare, peace, and freedom from fear. By redirecting 50% of software and AI wealth directly back into people's pockets and ending the economic incentives for war, we can systematically eliminate needless suffering in our lifetime.";
        setChatHistory((prev) => [
          ...prev,
          {
            sender: 'guide',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error('API unavailable');
      }
    } catch (err) {
      // Warm fallback response
      let fallbackText = "At its core, this mission is about treating every single person with reverence. For generations, society has accepted that some people must suffer, starve, or live in fear so others can be rich. We reject that lie. With today's technology, there is more than enough food, energy, medicine, and wealth for all 8 billion of us. By enforcing a 50% automated wealth return from all AI and technology directly to everyday people, we transform machines from tools of greed into engines of universal human liberation.";
      
      if (userText.toLowerCase().includes('how') || userText.toLowerCase().includes('start') || userText.toLowerCase().includes('do')) {
        fallbackText = "You can start right now in three simple ways: First, sign the Human Pledge and commit to rejecting hatred and greed in your daily interactions. Second, spread this vision to your family and friends. Third, demand that the companies and digital tools you use adopt ethical 50/50 revenue sharing so your hard-earned money supports real human beings, not billionaire monopolies.";
      } else if (userText.toLowerCase().includes('hate') || userText.toLowerCase().includes('violence') || userText.toLowerCase().includes('war')) {
        fallbackText = "Hatred and war are almost always manufactured by powerful interests who profit from weapons and division. When we guarantee basic living security, clean water, and healthcare to every family on Earth, the artificial panic that fuels hatred evaporates. When people feel safe, fed, and valued, peace becomes our natural state.";
      }

      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'guide',
          text: fallbackText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Handle Pledge Sign
  const handleSignPledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim()) return;

    const name = pledgeName.trim();
    localStorage.setItem('human_pledge_signed', 'true');
    localStorage.setItem('human_pledge_name', name);
    setPledgeSigned(true);
    setPledgeSignerName(name);
    setTotalPledgeCount((prev) => prev + 1);

    // Auto-add to community wall
    const newPost = {
      name: name,
      role: 'Guardian of Human Dignity',
      location: 'Earth Citizen',
      quote: `I have taken the pledge to stand against needless greed, hate, and violence. May we build a world where every soul is cherished.`,
      date: 'Just now'
    };
    const updatedWall = [newPost, ...wallPosts];
    setWallPosts(updatedWall);
    localStorage.setItem('human_community_wall', JSON.stringify(updatedWall));
  };

  // Handle Community Wall Post
  const handlePostToWall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallAuthor.trim() || !newWallMessage.trim()) return;

    const newPost = {
      name: newWallAuthor.trim(),
      role: 'Community Voice',
      location: newWallLocation.trim() || 'Global Citizen',
      quote: newWallMessage.trim(),
      date: 'Just now'
    };

    const updated = [newPost, ...wallPosts];
    setWallPosts(updated);
    localStorage.setItem('human_community_wall', JSON.stringify(updated));
    setNewWallAuthor('');
    setNewWallLocation('');
    setNewWallMessage('');
    setWallSubmitted(true);
    setTimeout(() => setWallSubmitted(false), 4000);
  };

  // Copy Pledge Link
  const handleCopyPledgeLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=mission-home#pledge`;
    navigator.clipboard.writeText(url);
    setCopiedPledge(true);
    setTimeout(() => setCopiedPledge(false), 2500);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#121210] text-[#E8E6DF]' : 'bg-[#FAF8F5] text-[#2D2926]'} font-sans selection:bg-[#D67D5C]/20`}>
      
      {/* 1. HERO SANCTUARY HEADER */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#E8E2D8] dark:border-[#2A2925]">
        {/* Soft atmospheric background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#D67D5C]/10 via-[#3D6E50]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3ED] dark:bg-[#1C281F] border border-[#C9D1BE] dark:border-[#2D4533] text-xs font-semibold text-[#3D6E50] dark:text-[#78B08B] mb-6 shadow-sm">
            <HeartHandshake className="w-3.5 h-3.5 text-[#3D6E50] dark:text-[#78B08B]" />
            <span>A Universal Public Mission for Every Human Soul</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#2D2926] dark:text-[#F3F1EC] leading-[1.15] mb-6 font-serif">
            Ending Needless Hate, Pain, Violence, Greed & Suffering.
          </h1>

          <p className="text-base sm:text-xl text-[#6A655C] dark:text-[#ABA497] max-w-3xl mx-auto leading-relaxed mb-8">
            You were not born to spend your life in fear, debt, and exhaustion while a handful of monopolists extract the world’s wealth. 
            We are building an open, ethical future where technology serves <strong>human dignity, peace, and shared abundance</strong> for all 8 billion of us.
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
            <a
              href="#pillars"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3D6E50] hover:bg-[#325A41] text-white font-medium text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              <span>Explore the 5 Pillars</span>
            </a>

            <a
              href="#pledge"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D67D5C] hover:bg-[#C26B4B] text-white font-medium text-sm shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>Sign the Human Pledge</span>
            </a>

            <button
              onClick={handleToggleAudio}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl border ${
                isPlayingAudio
                  ? 'bg-[#EBF3ED] dark:bg-[#1C281F] border-[#3D6E50] text-[#3D6E50]'
                  : 'bg-white dark:bg-[#1E1D19] border-[#DCD5CA] dark:border-[#383630] text-[#2D2926] dark:text-[#E8E6DF] hover:border-[#8C857B]'
              } font-medium text-sm transition-all shadow-sm`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 text-[#3D6E50] animate-pulse" />
                  <span>Pause Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#D67D5C]" />
                  <span>Listen to Voice Audio</span>
                </>
              )}
            </button>

            <a
              href="/downloads/human_ethical_ai_complete_gemini_notebook.zip"
              download="human_ethical_ai_complete_gemini_notebook.zip"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8C5A85] hover:bg-[#794972] text-white font-medium text-sm shadow-md transition-all transform hover:-translate-y-0.5"
              title="Download full project code and notebook markdown bundle for Gemini Notebook & NotebookLM"
            >
              <Archive className="w-4 h-4 text-[#F5D5C6]" />
              <span>Gemini Notebook ZIP (.zip)</span>
            </a>
          </div>

          {/* Live Mission Counter Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-[#E8E2D8] dark:border-[#2A2925]">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] shadow-xs">
              <span className="text-[11px] font-mono text-[#8C857B] block uppercase tracking-wider">The Revenue Covenant</span>
              <div className="text-xl font-bold font-mono text-[#3D6E50] dark:text-[#78B08B] mt-0.5">50% to People</div>
              <span className="text-[11px] text-[#6A655C] dark:text-[#8E877B]">Hardcoded to Creators</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] shadow-xs">
              <span className="text-[11px] font-mono text-[#8C857B] block uppercase tracking-wider">Planetary Scope</span>
              <div className="text-xl font-bold font-mono text-[#2D2926] dark:text-[#F3F1EC] mt-0.5">8.1 Billion</div>
              <span className="text-[11px] text-[#6A655C] dark:text-[#8E877B]">Every Soul Protected</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] shadow-xs">
              <span className="text-[11px] font-mono text-[#8C857B] block uppercase tracking-wider">Pledges Signed</span>
              <div className="text-xl font-bold font-mono text-[#D67D5C] mt-0.5">{totalPledgeCount.toLocaleString()}</div>
              <span className="text-[11px] text-[#6A655C] dark:text-[#8E877B]">Citizens Standing for Peace</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] shadow-xs">
              <span className="text-[11px] font-mono text-[#8C857B] block uppercase tracking-wider">Corporate Skimming</span>
              <div className="text-xl font-bold font-mono text-[#3D6E50] dark:text-[#78B08B] mt-0.5">$0.00 / 0%</div>
              <span className="text-[11px] text-[#6A655C] dark:text-[#8E877B]">Non-Profit Immutable Trust</span>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE 5 PILLARS: WHAT WE ARE HEALING */}
      <section id="pillars" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-serif mb-4">
            The Five Evils We Are Ending & The Five Pillars We Are Building
          </h2>
          <p className="text-sm sm:text-base text-[#6A655C] dark:text-[#ABA497] leading-relaxed">
            Suffering is not a permanent law of nature. It is the consequence of broken, extractive systems. Here is exactly how we dismantle each form of suffering and replace it with human flourishing.
          </p>
        </div>

        {/* 5 Tabs / Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
          {PILLARS_DATA.map((pillar) => {
            const isSelected = selectedPillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? `${pillar.bgLight} dark:bg-opacity-20 border-[${pillar.color}] shadow-sm ring-1 ring-[${pillar.color}]`
                    : 'bg-white dark:bg-[#1A1916] border-[#E8E2D8] dark:border-[#2D2B26] hover:border-[#C4BCB0]'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold text-[#8C857B] block">Pillar</span>
                <span className="text-xs sm:text-sm font-bold text-[#2D2926] dark:text-[#F3F1EC] line-clamp-1 mt-0.5">
                  {pillar.evilTarget}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Deep Dive Card */}
        <div className="rounded-2xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] p-6 sm:p-10 shadow-sm transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8] dark:border-[#2A2925] mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2" style={{ backgroundColor: `${activePillar.color}15`, color: activePillar.color }}>
                <span>Target: {activePillar.evilTarget}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-serif">
                {activePillar.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#6A655C] dark:text-[#8E877B] max-w-md italic leading-relaxed">
              "{activePillar.tagline}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Problem */}
            <div className="p-5 rounded-xl bg-[#FAF8F5] dark:bg-[#151412] border border-[#E8E2D8] dark:border-[#282723]">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#D67D5C] uppercase tracking-wider mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>The Reality Today (The Root Problem)</span>
              </div>
              <p className="text-xs sm:text-sm text-[#5A554D] dark:text-[#B5AFA4] leading-relaxed">
                {activePillar.theRootProblem}
              </p>
            </div>

            {/* The Solution */}
            <div className="p-5 rounded-xl bg-[#EBF3ED]/60 dark:bg-[#1C281F]/40 border border-[#C9D1BE] dark:border-[#2D4533]">
              <div className="flex items-center gap-2 text-xs font-bold font-mono text-[#3D6E50] dark:text-[#78B08B] uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>The Human Solution (The Concrete Action)</span>
              </div>
              <p className="text-xs sm:text-sm text-[#2D2926] dark:text-[#E2DFD8] leading-relaxed font-medium">
                {activePillar.theHumanSolution}
              </p>
            </div>
          </div>

          {/* Real World Impact List */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D8] dark:border-[#2A2925]">
            <h4 className="text-xs font-mono font-bold uppercase text-[#8C857B] tracking-wider mb-4">
              Concrete Real-World Deliverables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {activePillar.realWorldImpact.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#161513] border border-[#E8E2D8] dark:border-[#2A2925] flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#3D6E50]/15 text-[#3D6E50] dark:text-[#78B08B] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-[#5A554D] dark:text-[#ABA497] leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Everyday Human Vignette */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-[#D67D5C]/10 via-[#3D6E50]/10 to-transparent border border-[#E8E2D8] dark:border-[#2D2B26] flex items-center gap-3">
            <Smile className="w-5 h-5 text-[#D67D5C] shrink-0" />
            <p className="text-xs text-[#2D2926] dark:text-[#E8E6DF] font-medium leading-relaxed">
              <strong>The Human Difference:</strong> {activePillar.everydayStory}
            </p>
          </div>
        </div>
      </section>

      {/* 3. EVERYDAY REALITY VS. THE ETHICAL FUTURE SIMULATOR */}
      <section className="py-16 bg-white dark:bg-[#151412] border-y border-[#E8E2D8] dark:border-[#2A2925]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold text-[#3D6E50] dark:text-[#78B08B] uppercase tracking-wider block mb-1">
              Interactive Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-serif mb-3">
              How This Directly Changes Everyday Life
            </h2>
            <p className="text-xs sm:text-sm text-[#6A655C] dark:text-[#ABA497]">
              Select an everyday life area below to see the difference between the extraction economy of today versus the world we are building.
            </p>
          </div>

          {/* Scenario Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { id: 'housing', label: 'Housing & Food' },
              { id: 'health', label: 'Healthcare & Medicine' },
              { id: 'work', label: 'Work & Labor' },
              { id: 'art', label: 'Music, Writing & Art' },
              { id: 'peace', label: 'War vs. Planetary Care' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveScenario(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeScenario === tab.id
                    ? 'bg-[#2D2926] text-white dark:bg-white dark:text-[#2D2926] shadow-sm'
                    : 'bg-[#FAF8F5] dark:bg-[#1E1D19] text-[#6A655C] dark:text-[#ABA497] border border-[#E8E2D8] dark:border-[#33312B] hover:border-[#8C857B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Side-by-Side Comparison Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The World Today */}
            <div className="p-6 rounded-2xl bg-[#FFF8F6] dark:bg-[#1E1412] border border-[#FADCD5] dark:border-[#3D2520]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#C84C32] uppercase mb-4">
                <AlertCircle className="w-4 h-4" />
                <span>The World Today (The Cost of Greed)</span>
              </div>
              
              {activeScenario === 'housing' && (
                <div className="space-y-3 text-xs text-[#5A554D] dark:text-[#C5BCB2] leading-relaxed">
                  <p>• Wall Street hedge funds buy up residential neighborhoods, driving rents up 40%–80%.</p>
                  <p>• Families live one missed paycheck away from eviction, while grocery monopolies record record profits.</p>
                  <p>• Millions of tons of edible food are thrown away daily to protect artificial pricing structures.</p>
                </div>
              )}

              {activeScenario === 'health' && (
                <div className="space-y-3 text-xs text-[#5A554D] dark:text-[#C5BCB2] leading-relaxed">
                  <p>• Basic insulin costs $3 to manufacture but is sold for $300 to desperate diabetics.</p>
                  <p>• Medical debt is the leading cause of personal bankruptcy in the wealthiest countries on Earth.</p>
                  <p>• Mental health therapy is treated as a luxury good, leaving millions to suffer in untreated loneliness.</p>
                </div>
              )}

              {activeScenario === 'work' && (
                <div className="space-y-3 text-xs text-[#5A554D] dark:text-[#C5BCB2] leading-relaxed">
                  <p>• AI automation is used to lay off thousands of workers with zero severance or shared equity.</p>
                  <p>• Workers endure 60+ hour workweeks at minimum wage while CEOs take $50M bonus packages.</p>
                  <p>• Burnout, chronic stress, and exhaustion dominate everyday life.</p>
                </div>
              )}

              {activeScenario === 'art' && (
                <div className="space-y-3 text-xs text-[#5A554D] dark:text-[#C5BCB2] leading-relaxed">
                  <p>• Massive AI models scrape musicians' and authors' life work with zero attribution or payment.</p>
                  <p>• Streaming services pay $0.003 per stream, making it impossible for independent artists to survive.</p>
                  <p>• Culture is saturated with low-effort synthetic sludge designed to optimize clickbait algorithms.</p>
                </div>
              )}

              {activeScenario === 'peace' && (
                <div className="space-y-3 text-xs text-[#5A554D] dark:text-[#C5BCB2] leading-relaxed">
                  <p>• $2.4 trillion spent annually on weapons of mass destruction and geopolitical warfare.</p>
                  <p>• Millions of families displaced into refugee camps with no safe sanctuary.</p>
                  <p>• Environmental destruction accelerated by military-industrial supply chains.</p>
                </div>
              )}
            </div>

            {/* The World We Are Building */}
            <div className="p-6 rounded-2xl bg-[#F2F8F4] dark:bg-[#121E15] border border-[#CDE3D4] dark:border-[#1F3E28]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#3D6E50] dark:text-[#78B08B] uppercase mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>The World We Are Building (The Human Covenant)</span>
              </div>

              {activeScenario === 'housing' && (
                <div className="space-y-3 text-xs text-[#2D2926] dark:text-[#D5DFD8] leading-relaxed">
                  <p>• <strong>Cost-Deflation Commons:</strong> Automated sustainable building and vertical food towers provide free baseline housing and organic nutrition.</p>
                  <p>• <strong>50% Living Floor:</strong> Automated initiative distributions guarantee no human being faces homelessness or hunger.</p>
                  <p>• Local community land trusts protect neighborhoods from speculative corporate predators.</p>
                </div>
              )}

              {activeScenario === 'health' && (
                <div className="space-y-3 text-xs text-[#2D2926] dark:text-[#D5DFD8] leading-relaxed">
                  <p>• <strong>Open-Source Healing:</strong> Life-saving drug formulas, diagnostics, and surgical robotic blueprints released patent-free to all humanity.</p>
                  <p>• Universal free mental health circles and trauma-recovery sanctuaries in every neighborhood.</p>
                  <p>• Complete elimination of medical bankruptcy through the Global Health Endowment.</p>
                </div>
              )}

              {activeScenario === 'work' && (
                <div className="space-y-3 text-xs text-[#2D2926] dark:text-[#D5DFD8] leading-relaxed">
                  <p>• <strong>50% Automated Dividends:</strong> When an AI or machine does the work, the profits stream directly to the people, not Wall Street.</p>
                  <p>• Humans are liberated from wage-slavery to spend time with family, learn, create, and care for each other.</p>
                  <p>• Work becomes an expression of personal passion, service, and purpose, rather than survival panic.</p>
                </div>
              )}

              {activeScenario === 'art' && (
                <div className="space-y-3 text-xs text-[#2D2926] dark:text-[#D5DFD8] leading-relaxed">
                  <p>• <strong>Micro-Royalty Rails:</strong> Every time human art, music, or writing inspires an AI generation, the creator receives instant Stripe Connect royalties.</p>
                  <p>• C2PA cryptographic trust seals authenticate authentic human craftsmanship.</p>
                  <p>• A global Renaissance where independent poets, musicians, painters, and storytellers thrive with steady income.</p>
                </div>
              )}

              {activeScenario === 'peace' && (
                <div className="space-y-3 text-xs text-[#2D2926] dark:text-[#D5DFD8] leading-relaxed">
                  <p>• <strong>Planetary Peace Dividend:</strong> Trillions diverted from arms contracts into clean ocean restoration, solar desalination, and soil regeneration.</p>
                  <p>• Multilateral treaties making mutual survival more profitable than conflict.</p>
                  <p>• Safe global borders, welcoming sanctuaries, and shared planetary stewardship.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. ASK THE MISSION GUIDE: REAL-TIME EMPATHETIC AI COMPANION */}
      <section className="py-16 md:py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#3D6E50] text-white flex items-center justify-center shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-serif">
                Ask the Mission Guide
              </h3>
              <p className="text-xs text-[#6A655C] dark:text-[#8E877B]">
                Have a question or worry? Ask anything about the vision, how we end suffering, or how this protects you.
              </p>
            </div>
          </div>

          {/* Chat Message Box */}
          <div className="space-y-4 max-h-80 overflow-y-auto p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141311] border border-[#E8E2D8] dark:border-[#262521] mb-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#3D6E50] text-white rounded-br-none'
                      : 'bg-white dark:bg-[#1F1E1A] text-[#2D2926] dark:text-[#E8E6DF] border border-[#E8E2D8] dark:border-[#33312B] rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-white/70' : 'text-[#8C857B]'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-[#8C857B] font-mono p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#3D6E50]" />
                <span>The Guide is reflecting on your question...</span>
              </div>
            )}
          </div>

          {/* Quick Pre-Set Questions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[11px] font-mono text-[#8C857B] self-center mr-1">Suggested:</span>
            {[
              "Why does so much greed exist?",
              "How does the 50% split work?",
              "What can I do as a regular person?",
              "How do we stop wars?"
            ].map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setChatQuestion(sample);
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#1E1D19] border border-[#E8E2D8] dark:border-[#33312B] text-[#5A554D] dark:text-[#B5AFA4] hover:border-[#3D6E50] hover:text-[#3D6E50] transition-colors"
              >
                {sample}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChatQuestion} className="flex gap-2">
            <input
              type="text"
              value={chatQuestion}
              onChange={(e) => setChatQuestion(e.target.value)}
              placeholder="Type your question here in your own words..."
              className="flex-1 px-4 py-3 rounded-xl bg-[#FAF8F5] dark:bg-[#151412] border border-[#DCD5CA] dark:border-[#383630] text-xs sm:text-sm text-[#2D2926] dark:text-[#E8E6DF] placeholder-[#8C857B] focus:outline-none focus:border-[#3D6E50] transition-colors"
            />
            <button
              type="submit"
              disabled={!chatQuestion.trim() || isChatLoading}
              className="px-5 py-3 rounded-xl bg-[#3D6E50] hover:bg-[#325A41] disabled:opacity-50 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </section>

      {/* 5. THE LIVING HUMAN PLEDGE */}
      <section id="pledge" className="py-16 md:py-24 bg-[#FAF8F5] dark:bg-[#121210] border-t border-[#E8E2D8] dark:border-[#2A2925]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-white to-[#F7F4EE] dark:from-[#1A1916] dark:to-[#141311] border-2 border-[#D67D5C]/30 shadow-md text-center">
            
            <div className="w-12 h-12 rounded-full bg-[#D67D5C]/15 text-[#D67D5C] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D67D5C] block mb-1">
              The Universal Citizen Accord
            </span>

            <h2 className="text-2xl sm:text-4xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-serif mb-4">
              The Human Pledge of Kindness, Dignity & Peace
            </h2>

            <p className="text-xs sm:text-sm text-[#6A655C] dark:text-[#ABA497] max-w-2xl mx-auto leading-relaxed mb-8">
              "I pledge to stand up against needless hate, cruelty, and greed in my daily life. I commit to treating every human being with unconditional dignity, choosing compassion over cynicism, and supporting technology that heals and feeds humanity."
            </p>

            {pledgeSigned ? (
              <div className="p-6 rounded-2xl bg-[#EBF3ED] dark:bg-[#1C281F] border border-[#C9D1BE] dark:border-[#2D4533] max-w-xl mx-auto text-left shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6 text-[#3D6E50] dark:text-[#78B08B]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#2D2926] dark:text-[#F3F1EC]">
                      Official Pledge Certificate: {pledgeSignerName || 'Guardian of Peace'}
                    </h4>
                    <span className="text-[11px] font-mono text-[#3D6E50] dark:text-[#78B08B]">
                      Verified Citizen #{(totalPledgeCount).toLocaleString()} on the Human Registry
                    </span>
                  </div>
                </div>
                <p className="text-xs text-[#5A554D] dark:text-[#ABA497] leading-relaxed mb-4">
                  Thank you for standing on the side of peace and human flourishing. Your commitment is permanently recorded in the spirit of this movement.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopyPledgeLink}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#161513] border border-[#C9D1BE] dark:border-[#2D4533] text-xs font-semibold text-[#3D6E50] dark:text-[#78B08B] hover:bg-[#F2F8F4] transition-colors"
                  >
                    {copiedPledge ? <Check className="w-3.5 h-3.5 text-[#3D6E50]" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedPledge ? 'Link Copied!' : 'Share Your Pledge'}</span>
                  </button>
                  <button
                    onClick={() => setPledgeSigned(false)}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs text-[#8C857B] hover:text-[#2D2926] dark:hover:text-white"
                  >
                    <span>Sign Another Name</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSignPledge} className="max-w-md mx-auto space-y-3">
                <input
                  type="text"
                  required
                  value={pledgeName}
                  onChange={(e) => setPledgeName(e.target.value)}
                  placeholder="Your Full Name or Chosen Signature"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#161513] border border-[#DCD5CA] dark:border-[#383630] text-xs sm:text-sm text-[#2D2926] dark:text-[#E8E6DF] placeholder-[#8C857B] focus:outline-none focus:border-[#D67D5C] transition-colors"
                />

                <div className="flex gap-2">
                  <input
                    type="email"
                    value={pledgeEmail}
                    onChange={(e) => setPledgeEmail(e.target.value)}
                    placeholder="Email (Optional – for certificate copy)"
                    className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-[#161513] border border-[#DCD5CA] dark:border-[#383630] text-xs sm:text-sm text-[#2D2926] dark:text-[#E8E6DF] placeholder-[#8C857B] focus:outline-none focus:border-[#D67D5C] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#D67D5C] hover:bg-[#C26B4B] text-white font-bold text-xs sm:text-sm transition-all shadow-sm shrink-0"
                  >
                    I Pledge
                  </button>
                </div>
                <span className="text-[11px] text-[#8C857B] block">
                  We never spam or sell your information. Your name stands as a public beacon of hope.
                </span>
              </form>
            )}

          </div>
        </div>
      </section>

      {/* 6. VOICES OF HOPE & COMMUNITY WALL */}
      <section className="py-16 md:py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono font-bold text-[#3D6E50] dark:text-[#78B08B] uppercase tracking-wider block mb-1">
              Global Solidarity
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-serif">
              Voices of Hope from Everyday People
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6A655C] dark:text-[#8E877B] max-w-md">
            Read messages from people across the world who refuse to accept despair, and add your own voice of kindness.
          </p>
        </div>

        {/* Community Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {wallPosts.slice(0, 8).map((post, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] shadow-xs flex flex-col justify-between"
            >
              <div>
                <p className="text-xs text-[#5A554D] dark:text-[#C5BCB2] leading-relaxed italic mb-4">
                  "{post.quote}"
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0EBE1] dark:border-[#262521] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#2D2926] dark:text-[#F3F1EC]">
                    {post.name}
                  </div>
                  <div className="text-[10px] text-[#8C857B]">
                    {post.role} • {post.location}
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#8C857B]">{post.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave a Note on the Wall */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26]">
          <h3 className="text-base font-bold text-[#2D2926] dark:text-[#F3F1EC] mb-1 font-serif">
            Leave a Message of Hope on the Global Wall
          </h3>
          <p className="text-xs text-[#6A655C] dark:text-[#8E877B] mb-4">
            Your words can be the spark that lifts someone out of loneliness or despair today.
          </p>

          {wallSubmitted ? (
            <div className="p-4 rounded-xl bg-[#EBF3ED] text-[#3D6E50] text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you! Your message of hope is now shining on the global wall.</span>
            </div>
          ) : (
            <form onSubmit={handlePostToWall} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newWallAuthor}
                  onChange={(e) => setNewWallAuthor(e.target.value)}
                  placeholder="Your Name (e.g. Maria G.)"
                  className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#151412] border border-[#DCD5CA] dark:border-[#383630] text-xs text-[#2D2926] dark:text-[#E8E6DF] placeholder-[#8C857B] focus:outline-none focus:border-[#3D6E50]"
                />
                <input
                  type="text"
                  value={newWallLocation}
                  onChange={(e) => setNewWallLocation(e.target.value)}
                  placeholder="City / Country (e.g. Toronto, Canada)"
                  className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#151412] border border-[#DCD5CA] dark:border-[#383630] text-xs text-[#2D2926] dark:text-[#E8E6DF] placeholder-[#8C857B] focus:outline-none focus:border-[#3D6E50]"
                />
              </div>
              <textarea
                required
                rows={2}
                value={newWallMessage}
                onChange={(e) => setNewWallMessage(e.target.value)}
                placeholder="Share a message of encouragement, love, or why you believe we can end needless suffering..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#151412] border border-[#DCD5CA] dark:border-[#383630] text-xs text-[#2D2926] dark:text-[#E8E6DF] placeholder-[#8C857B] focus:outline-none focus:border-[#3D6E50]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#3D6E50] hover:bg-[#325A41] text-white text-xs font-semibold transition-all shadow-xs"
              >
                Post to Global Wall
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 bg-[#FAF8F5] dark:bg-[#151412] border-t border-[#E8E2D8] dark:border-[#2A2925]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-mono font-bold text-[#3D6E50] dark:text-[#78B08B] uppercase tracking-wider block mb-1">
              Clarity & Truth
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-serif">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#2D2926] dark:text-[#F3F1EC] hover:bg-[#FAF8F5] dark:hover:bg-[#1F1E1A] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#3D6E50]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-[#8C857B]" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-[#6A655C] dark:text-[#ABA497] leading-relaxed border-t border-[#F0EBE1] dark:border-[#262521]">
                      <p className="mt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. EXPLORE DEEPER: CONNECTING TO DETAILED ROADMAP & APPS */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1A1916] border border-[#E8E2D8] dark:border-[#2D2B26] shadow-sm text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[#2D2926] dark:text-[#F3F1EC] font-serif mb-3">
            Want to Dive Into the Technical Architecture & 7-Phase Roadmap?
          </h3>
          <p className="text-xs sm:text-sm text-[#6A655C] dark:text-[#8E877B] max-w-2xl mx-auto leading-relaxed mb-6">
            For researchers, developers, creators, and economists who want to inspect the full macroeconomic mathematics, smart contract code, C2PA standards, and phase-by-phase timeline.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onNavigateToRoadmap && (
              <button
                onClick={onNavigateToRoadmap}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1F1E1A] border border-[#DCD5CA] dark:border-[#383630] text-xs font-semibold text-[#2D2926] dark:text-[#E8E6DF] hover:border-[#3D6E50] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#3D6E50]" />
                <span>View Full 7-Phase Master Plan</span>
              </button>
            )}

            {onNavigateToInitiative && (
              <button
                onClick={onNavigateToInitiative}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1F1E1A] border border-[#DCD5CA] dark:border-[#383630] text-xs font-semibold text-[#2D2926] dark:text-[#E8E6DF] hover:border-[#3D6E50] transition-colors"
              >
                <Scale className="w-3.5 h-3.5 text-[#D67D5C]" />
                <span>Executive Cockpit & Sliding Scales</span>
              </button>
            )}

            {onNavigateToFund && (
              <button
                onClick={onNavigateToFund}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#1F1E1A] border border-[#DCD5CA] dark:border-[#383630] text-xs font-semibold text-[#2D2926] dark:text-[#E8E6DF] hover:border-[#3D6E50] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#4B6B94]" />
                <span>Global $4.5T Sovereign Fund Architecture</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="py-12 border-t border-[#E8E2D8] dark:border-[#2A2925] text-center text-xs text-[#8C857B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HumanLogo size="sm" showText={false} />
            <span className="font-bold text-sm text-[#2D2926] dark:text-[#F3F1EC]">The H.U.M.A.N. Ethical AI Initiative</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed mb-4 text-[#6A655C] dark:text-[#8E877B]">
            Dedicated to ending needless pain, hate, greed, and violence by placing ethical technology at the service of every living soul.
          </p>
          <div className="text-[11px] font-mono text-[#8C857B]">
            Zero Corporate Extraction • 50% Society Fund Hardcoded • C2PA Certified
          </div>
        </div>
      </footer>

    </div>
  );
};
