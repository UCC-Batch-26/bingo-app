import { HowToPlayCards } from '../components/how-to-play-cards';
import { AboutCards } from '../components/about-cards';
import { BoxCard } from '../components/box-card';

export function LandingPage() {
  return (
    <div className="w-full h-dvh flex-center flex-col bg-gradient text-[#fff]">
      <div className=" w-[68%] h-[95%] flex-center flex-col">
        <header className="flex-[0.5] size flex justify-center items-start">
          <nav className="border-[2px] border-[#E25645] bg-[#f9f9f9] w-[95%] h-[70px] rounded-[10px] flex-center px-[20px]">
            <div className="w-[40px] h-[40px]">
              <BoxCard letter="B" bgColor="#32BAEC" borderColor="#0C6795" fontSize={35} />
            </div>
            <div className="flex-[1]"></div>
          </nav>
        </header>

        <div className="flex-[2] size  flex-center">
          <div className="flex-[1] size  flex-center">
            <div className="bg-[] w-[80%] h-[80%] flex justify-start items-start flex-col gap-[20px]">
              <div className="w-[100%] h-[30%] ">
                <p className="text-[40px] font-[1000]">Play Bit9o,</p>
                <p className="text-[30px] font-[700]">Together Anywhere</p>
              </div>
              <div className="w-[100%] h-[40%] ">
                <p className="text-justify text-[15px]">
                  Enjoy the classic fun of bitgo with a modern twist! Create or join rooms, invite your friends, and
                  play together online—whether you’re near or far. Simple, social, and full of laughs, bingo nights are
                  now just a click away.
                </p>
                <div className="w-[100%] h-[100px] border"></div>
              </div>
            </div>
          </div>

          <div className="flex-[1.5] size flex-center">
            <div className=" w-[76%] h-[80%] flex-center flex-col ">
              <div className="w-[100%] h-[80px] flex-center">
                <BoxCard letter="B" bgColor="#32BAEC" borderColor="#0C6795" fontSize={60} />
                <BoxCard letter="I" bgColor="#F37213" borderColor="#D82C23" fontSize={60} />
                <BoxCard letter="T" bgColor="#FFD93D" borderColor="#BC7E06" fontSize={60} />
                <BoxCard letter="9" bgColor="#C6B29B" borderColor="#7D6450" fontSize={60} />
                <BoxCard letter="O" bgColor="#6BCB77" borderColor="#2C7A25" fontSize={60} />
              </div>
              <div className="bg-[#FF4D6D] size flex-[1] p-[10px] shadow">
                <form
                  action=""
                  className="bg-[#f9f9f9] border-[2px] border-[#9B17F8] size p-[20px] flex-center flex-col"
                >
                  <div className="w-[100%] h-[140px]  text-[#000] flex-center flex-col gap-[10px]">
                    <div className="w-[90%] border-[1px] border-[#C6B29B] rounded-[5px] flex p-[5px] gap-[10px]">
                      <p className="bg-[#C6B29B] p-[5px] rounded-[3px]">Name:</p>
                      <input type="text" className="w-[100%] outline-none" placeholder="Enter your username" />
                    </div>

                    <div className="w-[90%] border-[1px] border-[#C6B29B] rounded-[5px] flex p-[5px] gap-[10px]">
                      <p className="bg-[#C6B29B] p-[5px] rounded-[3px]">Code:</p>
                      <input type="text" className="w-[100%] outline-none" placeholder="Enter your code here" />
                    </div>
                  </div>

                  <div className="size flex-[1]  text-white flex-center flex-col gap-[10px]">
                    <button className="bg-[#FF4D6D] w-[90%] text-[35px] rounded-[10px] p-[10px] font-[700]">
                      PLAY
                    </button>
                    <button className="bg-[#9B17F8] w-[90%] text-[16px] p-[10px] rounded-[10px] font-[700]">
                      CREATE ROOM
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="flex-[1] size flex-center flex-col gap-[20px]">
            <div className="w-[80%] h-[auto]">
              <p className="text-[18px font-[700] text-[#564D43]">🎲 HOW TO PLAY</p>
            </div>
            <HowToPlayCards
              type="Host"
              description="Playing is simple and fun. As a Host, you can create a bingo room in seconds, set your own
                game rules, and share a unique code with your friends—just like starting a Zoom call. Once everyone is
                in, you control the game and call the numbers."
            />

            <HowToPlayCards
              type="User"
              description="As a User, all you need is the code from the host. Enter it in the app, grab your bingo card, and start marking the numbers as they are called. When you complete the winning pattern, shout “Bingo!” and celebrate with your friends online. "
            />
          </div>
        </div>

        {/* About */}
        <div className="flex-[1] size flex justify-start items-center flex-col gap-[30px]">
          <p className="text-[14px]">
            Host and join bingo games with friends online—just like hanging out, no matter the distance.
          </p>
          <div className="bg-[#9B17F8] w-[75%] h-[70%] rounded-[10px] shadow flex-center ">
            <div className="flex-center w-[95%] h-[80%] gap-[15px]">
              <div className="flex-[1] size flex-center">
                <div className="w-[100%] h-[25%] flex-center ">
                  <BoxCard letter="A" bgColor="#32BAEC" borderColor="#0C6795" fontSize={25} />
                  <BoxCard letter="B" bgColor="#F37213" borderColor="#D82C23" fontSize={25} />
                  <BoxCard letter="O" bgColor="#FFD93D" borderColor="#BC7E06" fontSize={25} />
                  <BoxCard letter="U" bgColor="#C6B29B" borderColor="#7D6450" fontSize={25} />
                  <BoxCard letter="T" bgColor="#6BCB77" borderColor="#2C7A25" fontSize={25} />
                </div>
              </div>
              <AboutCards
                title="Bitgo Made Social."
                description="Bring the classic bingo vibe online! Host a room, share the code, and play with your barkada anytime. Simple, exciting, and always fun."
              />
              <AboutCards
                title="Connecting People Through Play."
                description="Our app transforms bingo into a modern social experience. Create a room, share the unique code, and enjoy seamless online game with friends."
              />
              <AboutCards
                title="Bitgo Nights, No Distance Needed."
                description="Forget boring nights—this is bitgo with a twist! Host your own game, drop a code, and let your friends hop in."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
