"use client";
import { useState, useEffect } from "react"

import Image from "next/image";

export default function Home() {
  const initialNotes = [
    "6A''", "4F''", "2D''", "7B'", "5G'", "3E'", "1C'",
    "6A", "4F", "2D", "1C", "3E", "5G", "7B",
    "2D'", "4F'", "6A'", "1C''", "3E''", "5G''", "7B''" 
  ];

  const staticSongs = [
    {
      name: 'Derinden',
      coverImage: 'derinden.jpg',
      tempo: 400,
      ellipsisDuration: 1000,
      note: `5 4 4 4 3 3 3 2 3 4 ...
      5 4 5 4 3 4 2 ...
      5 4 4 4 3 3 3 2 3 4 ...
      5 4 5 4 3 4 3 2 ...
      5 4 4 4 3 3 3 2 3 4 ...
      5 4 5 4 3 4 3 2 ...
      5 4 4 4 3 3 3 2 3 4 ...
      5 4 5 4 3 4 3 2 ...
      5 4 4 4 3 3 3 2 3 4 ...
      5 4 5 4 3 4 3 2 ...
      5 4 4 4 3 3 3 2 3 4 ...
      5 4 5 4 3 4 3 2 ...
      5 4 4 4 3 3 3 2 3 4 ...
      5 4 5 4 3 4 3 2 ...`
    },
    {
      name: 'Hatırla Sevgili',
      coverImage: 'hatirla-sevgili.jpg',
      tempo: 400,
      ellipsisDuration: 1000,
      note: `6  1'  3'  2'  1'  3' ...
      6  1'  3'  2'  1'  7 ...
      7  1'  2'  1'  7  2'  4' ...
      3'  7  1'  2'  1'  7  6 ...
      5'  6'  7'  5'  4'  3' ...
      4'  4'  3'  2'  1'  3' ...
      4'  4'  3'  2'  1'  3'  2'  1'  7  6 ...
      7  1'  2'  1'  7  6`
    },
    {
      name: 'Uğurlar Olsun',
      coverImage: 'ugur-mumcu.jpg',
      tempo: 350,
      ellipsisDuration: 500,
      note: `3' 3' 3' 3' ...
      2 3' 4' 3' 2' 2' 1' ...
      2' 3' 2' 1' 1' 7 ...
      1' 2' 1' 7 7 6 ...
      2' 2' 2' 2' 1' 2' ...
      1' 2' 3' 2' 1' 1' ...
      7 1' 2' 1' 7 7 6 ...
      7 1' 7 6 6 ...
      2' 2' 2' 3' 2' 1' 2' ...
      1' 2' 3' 2' 1' 1' ...
      7 1' 2' 1' 7 7 6 ...
      7 1' 7 6 6`
    },
    {
      name: 'Ordu\'nun Dereleri',
      coverImage: 'ordunun-dereleri.png',
      tempo: 350,
      ellipsisDuration: 400,
      note: `5 6 7 7 7 2' 7 1' ... 7 6
      7 1' 1' 7  1' ... 7 ... 7 6 7 ... 6 5
      ... 5 6 7 1' 7 7 ... 7 6 7 ... 6 5
      ... 5 6 6 ... 6 ... 7 6 5 4 5 ... 4 3
      ... 5 4 3 4 3 ... 3`
    },
    {
      name: 'Çav Bella',
      coverImage: 'cav-bella.jpg',
      tempo: 300,
      ellipsisDuration: 750,
      note: `3  6  7  1'  6 ...  3  6  7  1'  6 ...
      3  6  7  1'  7  6  1'  7  6  
      3'  3'  3'  2'  3'
      4'  4'  4' ... 4'  3'  2'  4'  3'  3' ...
      3'  2'  1'  7  3'  1'  2'  3' ...
      4' 4'  4' ... 4'  3'  2'  4'  3'  3' ...
      3'  2'  1'  7  3'  1'  7  6 ...`
    },
  ]

  const convertNoteArrayToObject = (array) => {
    return array.map(note => {
      const number = parseInt(note.charAt(0));
      const letter = note.charAt(1);
      let dot = '';
      if (note.includes("''")) {
        dot = '..'
      } else if (note.includes("'")) {
        dot = '.'
      } 
      
      return {
        number,
        letter,
        dot
      };
    });
  }

  const convertNoteStringToObject = (noteString) => {
    const insideParentheses = noteString.match(/\((.*?)\)/);
    if (insideParentheses) {
      const data = insideParentheses[1];
      const dataArray = data.split('-').map(item => item.trim());
    
      return dataArray;
    }

    const number = noteString.charAt(0);
    const dot1 = noteString.charAt(1) ? noteString.charAt(1).replace("'", ".") : '';
    const dot2 = noteString.charAt(2) ? noteString.charAt(2).replace("'", ".") : '';
    const dot = dot1 + dot2;

    return {
      number,
      dot
    };
  }

  const noteObjects = convertNoteArrayToObject(initialNotes)

  const [autoPlayNote, setAutoPlayNote] = useState('');
  const [notes, setNotes] = useState(noteObjects);
  const [currentPressedNote, setCurrentPressedNote] = useState('');
  const [songs, setSongs] = useState(staticSongs);
  const [selectedSongNote, setSelectedSongNote] = useState('');
  const [selectedSongTempo, setSelectedSongTempo] = useState(400);
  const [selectedSongEllipsisDuration, setSelectedSongEllipsisDuration] = useState(800);
  const [audio, setAudio] = useState(null)

  const playNotes = (event = null, song = null) => {
    if(event) {
      event.preventDefault()
    }

    const tempo = selectedSongTempo; // Milliseconds
    const ellipsisDuration = selectedSongEllipsisDuration; // Milliseconds

    let index = 0;
  
    const playNextNote = () => {
      const getAllNotes = song ? song.split(/\s+/) : autoPlayNote.split(/\s+/);

      if (index < getAllNotes.length) {
        const note = getAllNotes[index].replace(/\n/g, '');

        if (note === "...") {
          setTimeout(() => {
            index++;
            playNextNote();
          }, ellipsisDuration);
        } else {
          const noteValue = convertNoteStringToObject(note);
          const getNoteObject = noteObjects.find(noteObject => parseInt(noteObject.number) === parseInt(noteValue.number) && noteObject.dot === noteValue.dot)
          if (Array.isArray(noteValue)) {
            for (let index = 0; index < noteValue.length; index++) {
              const subNote = noteValue[index];
              const noteValueObject = convertNoteStringToObject(subNote);
              const getNoteObject = noteObjects.find(noteObject => parseInt(noteObject.number) === parseInt(noteValueObject.number) && noteObject.dot === noteValueObject.dot);
          
              setTimeout(() => {
                playAudio(null, getNoteObject);
              }, index * 500); // Her bir not için 100ms gecikme
            }
          } else {
            playAudio(null, getNoteObject);
          }
  
          index++;
          setTimeout(playNextNote, tempo);
        }
      }
    }
  
    playNextNote();
  }

  const playAudio = (noteIndex, audioPath = null) => {
      const getNote = audioPath ? audioPath : notes[noteIndex];
      const audioName = getNote.number + getNote.letter + getNote.dot.replace(/\./g, "'")
      setCurrentPressedNote(getNote.number + getNote.letter + getNote.dot)
      const fileName = `note-audios/${audioName}.mp3`; // Özel karakterleri temizleme
      audio.src = fileName;
      audio.play().then(() => {
        setTimeout(() => {
          setCurrentPressedNote('')
        }, 10)
      });
  }

  useEffect(() => {
    if(selectedSongNote) {
      playNotes(null, selectedSongNote)
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSongNote]);

  useEffect(() => {
    setTimeout(() => {
      if(audio) {
        audio.addEventListener('ended', () => {
          setSelectedSongNote('')
          setSelectedSongTempo(400);
          setSelectedSongEllipsisDuration(800)
        });
      }
    }, 100)
   
  }, [audio])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setAudio(new Audio()) // only call client
  })

  const { height, width } = window.screen;
  const isPortrait = height > width;

  if(isPortrait) {
    alert("Please turn the screen to landscape.")
  }

  return (
      <div className="h-screen grid">
        <div className="flex space-x-[1vw] lg:space-x-[15px] transition-all">
          {noteObjects.map((note,index) => (
            <div 
              onClick={() => playAudio(index)}
              style={{
                height:  index <= notes.length / 2 ? `calc(40vh + ${index * 20}px)` :  `calc(40vh + ${(notes.length / 2) * 20}px - ${ 0 - (index * 20 - (index - notes.length /2  + index) * 20)}px)`,
              }} 
              className= {
                `${currentPressedNote === note.number + note.letter + note.dot ? 'opacity-70 animatecss-shakeY' : ''}
                kalimba-key landscape:w-8 landscape:lg:w-10 pt-12 rounded-br-2xl rounded-bl-2xl transition-all text-2xl pb-2 hover:opacity-90 cursor-pointer bg-gradient-to-t from-stone-700 to-indigo-600 
                text-white font-bold text-center animatecss active:animatecss-shakeY select-none flex flex-col items-center 
                justify-end`
              } 
              key={index} 
              data-note={note.number}
            >
              <p className="text-sm md:text-xl">{note.dot}</p>
              <p className="text-sm md:text-xl">{note.number}</p>
              <p className="text-sm md:text-xl">{note.letter}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center mt-12 space-x-4 select-none">
          <Image src={"/kalimba.png"} width={64} height={64} alt=""/>
        </div>
        <div className="flex items-center justify-center mt-12 space-x-4 select-none">
          <p className="text-3xl text-black">Our Playlist</p>
        </div>
          <div className="flex items-center justify-between w-full select-none">
            <div className="flex justify-center w-full mt-10">
              {songs.map((song,songIndex) => (
              <div 
                  onClick={() => {
                    if (!selectedSongNote) {
                      setSelectedSongNote(song.note);
                      setSelectedSongTempo(song.tempo);
                      setSelectedSongEllipsisDuration(song.ellipsisDuration)
                    }
                  }}
                  key={songIndex} 
                  className={`flex flex-col mr-2 justify-center items-center hover:opacity-90 space-y-4 ${selectedSongNote && song.note !== selectedSongNote ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                <Image src={`/song-covers/${song.coverImage}`} width={90} height={90} alt="" className="object-cover h-full rounded-lg shadow-xl"/>
                <p className="font-normal text-black">{song.name}</p>
            </div>
            ))}
            </div>
          </div>
        <form onSubmit={playNotes} className="mt-20 flex justify-center flex-col px-3 py-2">
            <div className="flex items-center justify-center space-x-2">
              <h1 className="text-black">Auto Note Play</h1>
              <span className="hidden h-auto w-auto px-2 rounded-full border-black border-2 bg-white border-1 border-solid justify-center items-center">ℹ</span>
            </div>
            <div className="mt-2 flex items-center justify-center rounded-lg">
                <textarea id="chat" rows="2" onChange={(e) => setAutoPlayNote(e.target.value)} className="block resize-none	w-80 mx-4 p-2.5 text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                placeholder="Enter the notes. e.g.: 6 7'' 1' ... 1'7 1' 2' 7 6 1'..."></textarea>
                    <button type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                    <svg className="w-5 h-5 rotate-90" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 18 20">
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                    </svg>
                    <span className="sr-only">Send message</span>
                </button>
            </div>
        </form>
        <div className="text-xs fixed p-2 rounded-lg shadow-xl bottom-2 ml-2 border-2 border-gray-300 bg-gray-50 text-gray-800 flex justify-center items-center">
          <a className="flex" href="https://www.linkedin.com/in/miracsengonul/" target="_blank">
            <Image src={`/music-note.png`} width={10} height={10} alt="" className="mr-2" />
            <p>Created by mirac</p>
          </a>
        </div>
      </div>
  )
}
