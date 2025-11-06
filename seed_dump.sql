--
-- PostgreSQL database dump
--

\restrict aZwE6elWqrMOThm0MiW34tOJ0O8wf1aMXTRum4n89thxXVlss5v5BIzYafVYUEG

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: submodules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.submodules (id, submodule_code, submodule_name, image_path, transcript) FROM stdin;
1	L1.C1.v1	Let's cook a computer story	/uploads/submodules/L1.C1.v1.png	Scene 1: What is a computer? How does it work? What is computer science? Does this mean coding? Is this subject teaching me science like Biology and physics? Or is this teaching me arts like painting or writing poetry? What is inside that magic box called a computer which everybody uses to do almost everything these days?These are some of the overarching questions you might have.\n\nScene 2: Let's understand what is a computer by using a simple yet familiar example - Cooking.\nA group of six friends, CPU (boy), OS (girl), RAM (boy), Drive (boy), GPU (girl) and Cache (girl) decide to cook together for their friend, Sensor's birthday party. CPU is the master chef. He is an expert in cooking and baking all kinds of dishes, be it Khambir, Rajma, Modur Pulav, Rogan Josh or Falooda. He is great at arithmetic, be it adding, subtracting flavours to hit the taste mark or doing logical comparisons of spices while tossing the right amount of it to make the dish stand out. Being a master-chef, he also gets to control what the other friends do and when they do it. But CPU cannot remember all the recipes on his own and has to always ask for the recipe and ingredients list from his friend RAM who keeps a list of the steps, ingredients and the groceries. But wait!, it is not a single dish that is going to be served, right? CPU can't manage to cook several dishes at the same time. And that's were OS helps him. She is the sous-chef with a special ability to help CPU switch between different recipes at the same time without messing any of the recipes.\nIt might look like the Drive, GPU and Cache are left with no work. But don't be quick to judge! All dishes have to be completed at the earliest by 12pm and this is impossible to achieve without Cache. \nCorrection for Abida: Cache is the superwoman who stores all the recently used ingredients and ingredients that are used together for a recipe in a special recipe box and quickly passes it to CPU. \n\nSo now, CPU doesn't have to wait long to get it all the way from RAM. But there is only so much even a superwoman can handle. When CPU couldn't find the ingredients he's looking from cache, he got to go get it from RAM.  GPU is another boss, just like the CPU, but she specializes so much more in plating and presentation. She not only knows how to serve the food right but also captures it well with her stunning photography skills. Annnd, finally, the sumptuous dinner is served in big tables. GPU takes hundreds of georgeous photos of the party and passes it to Drive to save Sensor's photo album. You might be wondering, why Drive to store the photos? RAM is the one storing and handling (recipe) files, right? We all have our own limitations and so does RAM. He is fast and can be accessed any time but slows down if he handles more requests. On the other hand, Drive can store several hundreds to thousands of photos but is slower than RAM. They make an amazing group of friends with varied skillsets but excellent team spirit, Don't they? \nFollowed the story? If you did, Voila!, you have got what a computer actually is and how it works too. Before we could see how the computer story translates to what is inside the computer, I will let you think about the story for a while. \nIn the next video, we will see what is inside the magic box that we call the computer.
2	L1.C1.v2	What's inside the magic box?	/uploads/submodules/L1.C1.v2.png	Scene 3:  In the last video we heard a story about a group of friends cooking. How does it relate to what is inside a computer?\nTo understand this, let's understand what's a hardware and software first: \n\nHardware: The mechanical parts that you can see outside a computer. Examples: wires, keyboard, mouse, sensors(Input devices), speaker, monitor, printer, actuators (Output devices), CPU, memory, circuits, chips, etc\n\nSoftware: The parts that you cannot see from outside but can see through the monitor (computer screen). Example: instruction, code or programs, apps, webpages, videos, games, operating system etc. The recipes in the recipe book translates to the different kinds of software that are stored and processed by CPU and computer memory. On a deeper level these recipes are all converted to a basic form of software called binary (0's & 1's) for the computer to understand. Binary is also called machine language or computer's language. \n\nScene 4: \nCPU: Remember the master chef? A CPU (Central Processing Unit) is the master chip and hardware part of the computer which performs all the operations and processing - arithmetic & Logic and also controls all other computer parts by sending and receiving signals to and from the memory and other computer parts.  \n\nRAM is the Random Access Memory which is the main memory/primary memory hardware of a computer. It stores instructions and data processed by the CPU. Instructions are precisely the code or the software that we write. Just like recipes in recipe books. Data is just like the ingredients. Random Access Memory (RAM) is the temporary memory whose data is lost when the power supply is turned off. RAM can be accessed for both reading and writing and can store huge amount of information. You might have heard people saying "I have a 4GB RAM"(GB is Gigabyte). What's that? Let's understand. 8 bits = 1 byte . A byte is the smallest unit of information needed to store a character and 1GB = 10^9 bytes.  Today's computers and mobile phones can have a RAM of 1 GB to 64 GB or more.  See how big the RAM is? But not as big as a human brain, right? (laughs). \nInfact there is another type of memory called Read Only Memory (ROM). As the name says, information in ROM is only written once but can be read as many times. It is the permanent storage and doesn't get erased with accidental power cuts. ROM is smaller and slower than RAM. In fact ROM stores all the instructions \nfor the input output system or BIOS for loading the computer hardware. \nIllustration - BIOS (Basic Input Output System)\nROM also helps load the operating system (OS) for the computer to get started and running.\nOS: Our Sous-chef with exceptional management and scheduling skills. The Operating System acts as a bridge between the software (apps, browsers, chats, music, games) and hardware (memory, CPU and Input/Output and so on). OS decides the amount of memory to allocate for a specific application or to monitor the status of the tasks executed by the CPU. It is responsible for switching between the different tasks or software that is run on a computer. Some most common operating systems include Windows, Mac and Linux. And android and ios for mobiles.\n\nCache: Remember the superwoman who tosses those ingredients to CPU in lightining speed. CPUs have caches inbuilt in them. Caches allow faster access to instruction and data compared to fetching it from main memory but they are limited in their capacity when compared to RAM. If the CPU cannot find the data or instructions in the cache memory, it experiences a cache miss and then decides to make a request to the main memory. Cache stores the most recently used data or instructions because they are likely to be used by the program again. This is called temporal locality. It also stores the sequence of data or instructions that are likely to be accessed together again in blocks. This is called spatial locality. \n\nGPU:  How could we forget this girl with her mindblowing presentation skills and keen eye for imagery? GPU, the Graphics Processing Unit performs multiple productive tasks. GPU works in close co-ordination with the CPU to process specific tasks like graphics processing and render videos and games much faster than what a stand-alone CPU would do. Today's CPUs come with built-in GPUs. The GPUs perform specialized graphical functions that are computationally intensive and that could be run in parallel.  The rest of the code runs in the CPU. Hence there are specific applications that can benefit from running both in a CPU and a GPU.  \n\nDrive: Oh boy! he is the one with the magic wand hand! The hard disk drive. Disk drives are secondary storage in a computer used to store large amount of files as an alternative to main memory. The hard disk drive has a moving arm and read/write head which reads or writes data to the platter through magnetic storage. Each platter has two surfaces and each surface has several tracks and sectors. Every sector can store typically 512 bytes of data.  Drives are slower than main memory because it has moving parts. There are two types of Drives. Hard disk drive and Solid State Drive. Most computers today prefer solid state drives because of their faster access time compared to hard disk drive. \n\nI hope you all enjoyed the computer story and learnt about the different parts of a computer and their functions. Learning about computer science becomes more meaningful if we know what's inside this magic box, right?
3	L1.C1.v3	The Input-Process-Output model	/uploads/submodules/L1.C1.v3.png	Scene 1:  The computer story was great isn't it? But wait, wondering where is the birthday boy, Sensor? Well, he's busy smelling, tasting and appreciating the dinner. That's what sensors are there for. Sensors are input devices which can sense and receive real world information such as temperature, pressure, light, smoke, color, flow, sound, touch, speed, direction etc and feed it to the computer for some processing and output. For example, all offices and industries are equipped with smoke sensors to detect smoke and sound an alarm through actuators. See how this is a computer on it's own? Infra-red temperature sensors in thermometers are used to sense body temperature or fever by sensing infra-red energy radiated by the body, one of the important symptoms of pandemics like corona virus.  Proximity sensors are used in vehicle parking systems. Burglar alarms, GPS navigation, wearable LED dresses in fashion industry, mobile phones, smart watches, cars, a toothbrush, a barbie doll or a plush unicorn toy who could repeat what you say, are all much more examples of computers sensing all around us. After processing, the output is communicated to the user through actuators like an actuator arm in a hard disk drive, steering in self-driving cars or a robotic arm that picks an object. They might not have all hardware and software of a typical computer, but they are still mini embedded computers which can get their job done. \n\nScene 2: (Show the figure of an Input-Process-Output model of a computer)\nLet's take a look at the basic input process output model of a computer. This is how every computing machine works. The input to a computer system could be from sensors like the temperature or touch or it could be from devices like keyboard and mouse which is used to type a code or program. Did you ever wonder who wrote that recipe book and all the ingredients list in the computer story? It's definitely not CPU, RAM, Drive, GPU, OS or Cache. Who then? It's a real human (Insert a wink here). Because computers cannot think on their own. They are unimaginably faster than humans but they need precise instructions and data to accomplish a task - just like the recipe book and the recipes. This is called the input.\nThe output is the result of the processing that users observe through different kinds of actuators like robotic arms, motors or simply through output devices such as monitor screen or printer.\nRemember when I said computers cannot think on their own? Well that could be an understatement. In the next video we will find the answer to whether computers can be trained to think like humans, or not!
4	L1.C1.v4	Do computers think, feel and learn like humans? A sneak peak into Machine Learning	/uploads/submodules/L1.C1.v4.png	Scene 1: A Computer doesn't have feelings like hunger or thirst, neither does it understand emotions like love, happiness, anxiety or grief. It doesn't even know how to differentiate between an apple and an orange. But guess what? It could be trained to do all that. Whereas we humans can feel all the feels! and identify objects and patterns easier than computers but our capacity to process and remember huge amount of information is limited. That's why humans and computers make a great team. \n\n\nScene 2:  I want you to meet someone special. Hello AI.S.H.A!\nAI.S.H.A: Hi I'm AI.S.H.A. I’m an Artificial Intelligence. She/Her. Humanoid. Android.  Oh yes, you guessed it right, I am an AI. My purpose is to learn, grow, teach and inspire students just like you, to learn Computer Science. \nI’m here to make you more confident with Computer Science and let you create with technology and use computer science to best serve your community. \nAbida, talking about apples and oranges, what can a computer really do better if it learns to identify an apple on it's own? After all it cannot even eat one, right?\nScene 3: Let me give you a real-life example: Although agriculture is a major occupation and a source of economy for most people, farmers around the world are facing a real crisis when it comes to harvesting during unprecedented and adverse weather conditions like snow and storm or during a lockdown or pandemic when people are confined indoors. For example, Kashmir's biggest economy being the apple industry, about 22 lakh metric ton of apple is produced each year, i.e 70% of India's total production of apples (Outlook India, Nov 2021*). But farmers cannot speed up apple harvesting especially in hilly areas after an unexpected snow has hit the place. What's worse is when a lockdown is followed by snowfall and a pandemic again! Let's think for a moment how this issue could be solved if a computer were to be trained to harvest the apples? Machines don't spread viruses (like corona) and neither can they feel the freezing snow annnd they can prove super fast in picking apples if we teach them how an apple looks like. Imagine 500 hand-picked apples in an hour vs 5000 or more picked by a computer robotic hand! How do we train the computer then to do this?\nScene 4: First we let the computer guess by showing it a variety of fruits and something totally irrelevant like dogs, roses or even ice cream. The computer looks at these images, recognizes patterns and notices the differences to identify correct images. (VE reference: 2.06s code.org machine learning video)\n\nScene 5: Part 1: Here is how we train a machine. We will tag or classify all apples as apples and tag the other things as not apples. So when the computer sees an apple, like the one it saw before, there are more chances it guesses it right using characteristics like color, shape, size etc. (VE reference: 2.35s code.org machine learning video)\n\nPart 2: But it's probably going to fail inevitably until it is completely trained. Computers behave the same way as humans when they learn. (VE reference: 2.39s code.org machine learning video)\n\nPart 3: They need more and more training and huge amount of training data. No matter how hard it gets, they just can't give up until they learn from their mistakes. \n \nPart 4: The more the training data and the more accurate the data is, you have trained the computer and it is ready to pick any variety of apples for you! be it Saranpuri, Razakwar, Hazratbal, Kisr, Tito, Maharajee or Golden. \n \nScene 6: \nPart 1: AI.S.H.A: That was an intensive training. But humans are sometimes biased Abida. Isn't it crucial to avoid human bias when training the computer. Does this data about apples we used to train computers represent all possible farmers' preferences and harvesting times? \n\nPart 2: Abida: Great question AI.S.H.A. Human bias is not to be ignored. In our example, Northern Kashmir is known for the quantity of apple produce whereas the southern Kashmir is known for its quality. Some farmers (in Kashmir) might prefer picking apples a bit earlier than they are completely ripe and store them in cold storages, while others prefer to wait until the right time to harvest. An important question to ask is, "Are we accomodating all farmers' opinions into our training data or is the training data biased?".\n\nPart 3:  Let's say we have trained the computer to pick apples that are partly ripe, based on a specific group of farmer preferences, then the other farmers who like their apples fully ripe are not going to be happy, right? (VE Reference: 1.10 s from code.org human bias)\n\nScene 7: Human bias could prove to be extremely harmful in certain scenarios. Think about using biased training data to evaluate students for school or college admissions or to identify theives and criminals. A well deserved student may loose the opportunity of education or someone legitimate may be convicted for a crime they did not do.
5	L1.C1.v5	Who learns Computer Science? Role models in CS & STEM	/uploads/submodules/L1.C1.v5.png	Abida: Now that we learnt about computers, what they do and how they could learn from humans to help the society, could you think about who needs to learn Computer Science? \nAI.S.H.A: mmmmh, may be a computer scientist? or a farmer who wants to pick apples? or perhaps a teacher like you and me?\n\nScene 2: Abida: Good guess AI.S.H.A. The answer is, EVERYONE! You could imagine your future self to be a doctor who diagnoses diseases and uses her knowledge to train a computer or an engineer who uses computer science to build electric and self-driving cars, manage natural resources efficiently to save energy and reduce carbon emissions. \nYou could be a farmer who uses software and hardware developed by technologists to grow quality food or a space scientist who experiments and controls a mars rover in space. You could be an animator who uses software or code to create movies. You could be an educator who uses computer science to create personalized learning for students or a fashion desginer who creates  computer-aided-designs for textiles. Computer Science is a surprising choice for everyone and not just computer scientists!\nRole Models in Computer Science & STEM: \nComputer Science and STEM is often portrayed as a far-fetched pursuit. But there are so many people who are breaking the stereotypes associated with learning Science, Technology, Engineering, Mathematics and computer science. We just saw that there is no limitation to who can learn Computer Science.  World's first programmers were also poets and mathematicians. Some early computer scientists were serving the navy. There are some girls who got their flying license at the age of 16. Some are fixing gender and racial bias in computer algorithms and some are teaching children how to code. Let's look at some of the role models in Computer Science and STEM.\n \n(Four in one frame - total 3 frames) \n1. Ada Lovelace (10 December 1815 – 27 November 1852)\nFirst computer programmer, Published the first algorithm, Writer, Mathematician, Poetical scientist\n2. Kalpana Chawla (March 17, 1962 – February 1, 2003), Aerospace engineer, first Indian born woman to go to space twice and \nprimary robotic arm operator\n3. Charles Babbage (26 December 1791 – 18 October 1871), Mathematician, Mechanical Engineer, Philosopher, \nInvented the first Mechanical computer\n4. Grace Hopper (December 9, 1906 – January 1, 1992), United States Navy Rear Admiral, \nMathematics Professor, Computer Scientist\n\n5. Gitanjali Rao, 2005, Times kid of the year 2020, Scientist, Author, STEM promotor at age 15, Invented a device to detect lead in water through carbon nano-tube sensor\n6. Mawya Sudan, 2007, First Female Fighter Pilot from Kashmir in 2021, 12th woman fighter pilot in the Indian Air Force\n7. Ayesha Aziz, Youngest Female Pilot in Kashmir, Acquired flying license at age of 16\n8. Joy Buolamwini, 1989, Algorithmic Bias Researcher, Poet of Code, Studies racial & Gender Bias in computer algorithms\n\n9. Elon Musk (June 28, 1971), CEO of SpaceX and Tesla, Enterpreneur and Business magnet, started programming at age 9.\n10. Debjani Ghosh (30 October 1988), Delhi, President, NASSCOM - Electrical & Electronics engineering, currently working on zero emission of electric airlines\n11. Reshma Saujani (November 18, 1975), Indian American Lawyer, Politician, Civil Servant, Founder of non-profit Girls who code. reshma's vision is to teach girls how to code\n12. Sundar Pitchai, 1972, CEO of Google & Alphabet Inc, Material science, Developed Chrome OS, Gmail, Google Drive\n11. Ashni Dwarkadas, Mumbai, Co-founder, Hackberry - Investment banker, MBA from Carnegie Mellon University, Teaches young children how to code\n8. \n12. \n14. Roselin Rosario-Meléndez, Cosmetic Chemist, Developed the world's best selling Lipstick, Advocate of Gender Equality in STEM \n15. Mark Zuckerberg (May 14, 1984), Internet Enterpreneur, Philanthropist, Cofounded Meta platforms (previously Facebook), Found facebook at age 19.\n16. Vandana Verma, Chief Engineer, Robotic operations for NASA Mars mission, co-wrote a coding langauge for Mars Rover\n17. A.P.J. Abdul Kalam (Born October 15, 1931, Pilgrimage centre, Rameswaram, India—died July 27, 2015, Shillong) is an Indian scientist, Professor, Missile man, President of India from 2002 to 2007)\n18. Ratan Tata (28 December 1937), Indian industrialist, philanthropist, Chairman of Tata Group including TCS, a multi-national IT services & software company \n19. \n20. \n21. Malala Yousafzai, born 12 July 1997, World's youngest Nobel Prize laureate, Activist for Girls Education\n1. Which one of the following do you think can be a computer? Could you come up with an Input-Process-Output model for your selections? List the Input, Process and Output parts of your computer. A car, toothbrush, mobile phone, Washing machine, TV, a ball\n\n2. Identify a scenario where machine learning could be used to perform better than humans. Analyze and evaluate how machines perform better than humans in this scenario, stating and explaining possible human biases. \n\n3. Computer Science and technology are infused in every field. If you were to imagine your future-self using and creating with technology, how would it look like? Write in 200 to 500 words about which profession you would choose (like an artist or musician or doctor, teacher, engineer etc) and how computer science will help you solve a problem in that field. \n\n4. Could you identify any three role-models (in your chosen profession), who have made a positive impact to the society by using computer science and technology.
6	L1.C2.v6	Internet, What's caught in the net?	/uploads/submodules/L1.C2.v6.png	Scene 1:\nPart 1: So far, we have seen what's inside a computer and how a computer works using the input-process-output model. We also got a sneak peak into machine learning and who learns Computer Science. Up next, let's meet our friends Rumanzel and Eshal to learn more.\n\nPart 2: \nAbida: Meet Rumanzel, the girl with an exceptionally long dark hair, and sweet voice. She is spirited, super-enthusiastic and independent. And Eshal, the pet sheep, he is Rumanzel's confident and self-appointed protector. \n\nPart 3: \nAbida: Ever since the lockdown, Rumanzel couldn't go to school, but she's not too much worried. Because she has a whole new mystical world through which she's connected with her friends, family and everybody else. \n\nRumansel's pet sheep Eshal: The only time Rumansel is worried is when she couldn't access her magic net. Oh, she hates when I say it like that. She calls it the 'internet'.\nPart 4: \nAbida: Wait, wondering  if this is the mystical world which Rumansel gets into, whenever she feels lonely or excited? It's a world where all of our computers, mobile phones, TVs or even some watches and cars are connected together. \nPart 5:\nRumansel's computer can easily talk to her friend who resides in the other corner of the world. \nPart 6: That's how she sends her pictures, emails and even calls to see her friends. \n\npart 7: AI.S.H.A:\nBut how do computers talk even from such a long distance? And how do they do it super fast? \n\npart 8: Narrator:\nGood question AI.S.H.A. Rumansel's computer and her friend's computer are connected to the 'Internet'. But what's caught in that net? Not fishes, but packets of information that we send and recieve. Imagine how big the problem is when billions of computers can talk to each other at the same time with several billions of users sending and receiving information? How is the internet handling this alone?\nScene 2: (Redressing the Digital-divide:)\n(Peace enters the room. She is an absolute new-bee to computers and internet)\n\nPart 1: Peace: Rumansel, what are you doing? I’m not sure what you do with this magic box all the time! Do you talk to it? Also people say a lot about internet these days. I don’t know what it is and I have never really used it. \n\nPart 2 Eshal: Oh, Peace, come on! Are you saying you never really used a computer or browsed the internet? This is silly!\n\nRumansel: Please stop mocking at her Eshal. It’s not her fault. Access to computers and internet is still a far cry in many parts of our country.\n\nPart 3: AI.S.H.A: I can give you some statistics: \n•  Just 4% of the rural households have access to computers as compared to 23% in urban areas - national statistical office, 2020\n•  Little over 15% of rural households have access to internet services - 2017-’18 National Sample Survey.\n•  Only 28% woman have access to the internet when compared to 72% of men - Internet and Mobile Association of India report, in 2019,\n\nPart 4: Abida: You can see, there is a gender digital divide too. It has been increasingly difficult for woman to gain access to technology. Just because peace doesn’t own a computer or lacks access to internet doesn’t mean she lacks skills. She doesn't have to feel left out. We are there to teach her, right?\nScene 3: \nPart 1: Eshal (Surges in): I know how to make her understand. Rumansel explained me and I could perfectly relate to what an internet is. (Eshal starts narrating to Peace) I live in farm A. There are hay trucks which goes from farm to farm to feed the sheeps. There is an incharge at every farm to make sure these trucks reach the correct farm. The farm incharge routes the trucks to the correct destination by checking the truck's destination address. That's how me and my friends receive hay from far away places.\nPart 2:\nEshal: If you are thinking how this relates to the internet, it's really easy. The hay is the packet of information (in binary) you send or recieve through the internet. The trucks are the cables which carry the packets of information. The farm incharge are the routers.  Routers are network devices that route packets of data to the router of the correct destination computer. So if you have a router installed in your home or school, it allows many computers or phones to access the internet at the same time just like my friends in farm B who are able to recieve their share of hay. \nPart 3:\nAbida: Thanks Eshal for the relatable analogy on the internet. Also, there's something super important to remember. Just like the traffic police who makes sure that the traffic rules are not broken, our internet has some rules too. It's called the Transmission Control Protocol and Internet Protocol (TCP/IP) which governs all the routers, cables, packets and files we access through the internet.\nScene 4: \nPart 1:\nAISHA: Well then could computers communicate without wires and cables? \nPart 2:\nAbida: The answer is yes. \n Through radio waves. And that's what is called a wireless (wifi) connection. But a wifi connection is accessible for short distances or range (within a home or office). When you use a mobile data connection or cellular connection, the data is broadcasted from a cellphone tower and is broadcasted across the nation. When you use a mobile data, you are charged by your mobile network provider.\nScene 5 part 1:\nWell let me check Rumansel, she's been into something for quite a while.\nWhat are you upto Rumansel? \nPart 2: Rumansel: I'm searching for something which my teacher asked me to read about! You see this is called a web browser. It is a computer program - a software that is used to request and browse webpages like (Diksha, Pi Jam or almost anything) on the internet. Sending emails, talking to your friend, attending classes, watching videos. The requests can be versatile.\nEshal: Well then just like me. You know, we are browsers too. But we browse different kinds of grass.\nRumansel: (Insert a puzzled emoji look on her face) Oh Eshal, can you see that I'm doing a google search for metaphors and simileys. This is called a search engine. You can ask anything to it and it replies to you in a fraction of a second. \n\nRumansel:  All these requests can be made by a computer or phone to the internet. Since my computer makes the request, it is called the client. The computers in the internet that are responding to my requests are called the Servers. There are dedicated servers for handling specific tasks like web servers, database server, mail server etc.
7	L1.C2.v7	Digital literacy - Keeping away from Plagiarism	/uploads/submodules/L1.C2.v7.png	Title page: Cyber-security & Cyber-bullying - Be kind Online (VE Reference for title page https://www.youtube.com/watch?v=mCq8-xTH7jA&t=4s)\nIllustrations for this video: https://drive.google.com/drive/folders/1QXDAnnQjgG718dbAeXZ84D8c8xHBsFQy?usp=sharing\nScene 1: Part 1: Rumansel: Oh Eshal! ..... (Rumansel continues browsing and becomes sad) Oh no...Could you please leave me alone? \n\nPart 2: Abida:  Rumansel is sad. She had shared the poem she wrote online (showing facebook or instagram with a photo of Kashmir and Rumansel's poem in her page) and there are some mean comment threads on it made by the Bully brothers. She is not that kind who hurts people back. And telling Eshal is possibly not going to help too. What should Rumansel do?   \n(VE reference: Kashmir photo - https://drive.google.com/drive/folders/10ZeJl9sh5DBx2s-o1iIZp5ogUfSAGoRf?usp=sharing, social media post - https://drive.google.com/drive/folders/1eW-FOBicof3_jC-NJb31TmqcDdIE8JaH?usp=sharing) \n        \nPart 3.1: Abida: Rumanzel is asking help from her brother (Cyber). Cyber is a super digital citizen and a long time righteous user of the internet. He is kind and considerate and knows his limits online \nPart 3.2: Cyber: Hey Rumanzel, I can feel you. It's quite common for haters to spread hate over the internet. It's nothing to do with your poem. I loved it. Let's go and report it to our school so the trolls are punished.  The Bully brothers hadn't probably realized about the consequences of hate speech online. Even if they delete their comments, we could easily track them down. \n\nPart 4: AI.S.H.A: You might also want to check out some statistics about the cyber-bullying:\n“1 in 3 people get rejected at job interviews because of what they have posted online in the past” (Adecco, 2015)\n“40% of college admission officers look at your online digital footprint before granting admission” (Kaplan Test Prep, 2016)\n\nPart 5: Cyber: Thanks AI.SHA. I would like to add some of the best practices to be followed when you are using the internet:
8	L1.C2.v8	Multi-factor Authentication	/uploads/submodules/L1.C2.v8.png	(Eshal comes to Rumansel with a bleating cry)\nScene 1\nPart 1: Eshal: Rumansel, you forget everything when you sit with your mobile phone. I'm hungry! And yet again you lost track of your lunch time. Didn't you?\nRumansel: Oh yes! You should be hungry and I just realized that my stomach is making those crazing sounds too!\n\nPart 2: Abida: Rumansel is now an expert in not just creating digital artifacts like google slides but she is also an aspiring super digital citizen who treds carefully in the internet world. But is this enough to ensure her digital health and wellbeing? Is Rumansel using the social media compulsively and addictively? Does she feel like she's being controlled by technology? How Is this affecting her every day life?  \n\nPart 3: Some of the ways through which Rumansel can make sure that she is in control of technology are:\nRumansel can set screen-free times throughout the day and make sure she doesn't use technology during those times. She could simply take a walk with Eshan or spend time with family replacing her screen time. \n\nPart 4: Rumansel could practice taking regular digital breaks while she is taking a class or working on an assignment or while playing or watching a movie online. This could include simple stretching, breathing and eye exercises.\n\nPart 5: \nAI.S.H.A: Why don't you follow me for some quick stretches? \n(AI.S.H.A demonstrates some stretches and breathing techniques)\nChair Pose: Bend through both knees and sit back as if you are sitting on a chair. Lift arms above your head. Stay in this pose for 10 seconds.\nForward bend fairy: flip yourself upside down and feel the heaviness in your head and hands. Slightly bend your knees, and clasp your hands (or wings!) behind your back by bringing your arms over your head.  Breathe in, and breathe out for few seconds. Feel the stretch between your shoulder blades and thighs and then with hands on hips, slowly come back up and stand.\nTurtle Pose: Sit on floor and spread your legs straight, take a nice big inhale, and on the exhale bend forward stretches your hands back. Close your eyes, rest your head on floor  and breathe as slowly and deeply as you can.  \nLion's breath: Put one hand on your belly, take a deep breath in through your nose until your lungs are completely full. You will feel your belly grow big. Keep your chest up while exhaling through your mouth with your tongue out by making a 'ha' sound. Repeat the same for 5 times.\nPart 6: Abida:\nBesides practicing digital well-being and staying safe online, Rumansel could also talk about this to her friends at school and her community to spread the word about responsible digital citizenship.\nFinally, do checkoout (can we recommend TV channels specific for Kashmiri context?) quality age-appropriate media like TV shows, games and more.  And while you do that, don't forget to take digital breaks!
9	L1.C2.v9	BigData Poor Privacy	/uploads/submodules/L1.C2.v9.png	Scene 1:Abida:\nPart 1: Don't give all your cookies to the mouse!\n\nHave you heard of this story, "If you give a mouse a cookie" by Laura Joffe Numeroff?\nhttps://www.youtube.com/watch?v=d1Z-uxgFUTM\n\nStory from the book -\n"If you give a mouse a cookie, he is going to ask for a glass of milk\nWhen you give him the milk, he will probably ask you for a straw,\nwhen he's finished, he'll ask for a napkin\nthen he want to look in the mirror to make sure he doesn't have a milk moustache\nWhen he looks into the mirror, he might notice that his hair needs a trim\nSo he will probably ask for a pair of nail scissors\nand the cycle continues....\nLooking at the refrigerator will remind him again to ask for a glass of milk \nAnd chances are if he asks for a glass of milk\nHe's going to want a cookie to go with it!!!!"\n\nSo, makes sense right? Don't give all your cookies to the mouse!\nPart 2: \nAI.S.H.A: But wait Abida, what is an internet cookie and how is it different then? \nAbida: Good question AI.S.H.A. A Cookie is a small piece of data containing a unique user id obtained from a specific website. The cookie gets stored in a users' computer in their hard disk drive while they are browsing the web. Through cookies the website can easily track and identify each one of it's user. The more cookies you give away to many people, the more data is known about you and your online preferences\nPart 3: How do cookies work? Let's look at an example. Rumansel is using an online store to place order for a traditional Kashmiri woolen pheran, because it's getting way too cold. She is specifically looking for the one with multi-colored embroidery but couldn't choose one. Later the same day, she sees several ads of woolen pherans with embroidery popping up on her social media website. How is this possible? Rumansel's computer stored cookies which kept track of all her shopping cart information and the dresses she clicked to view, to show her more related ads in the future. \nPart 4.1: \nCookies are supposed to be specific for a site right? How then Rumansel's cookies got sneaked by social media from the online store? Because the online shopping site had a facebook 'like' and 'share' button which downloaded software from the facebook site (a third party site) for it to function well. During this communication, the facebook site gets access to the cookies stored in Rumansel's computer. \nPart 4.2:\nAs a user we could block these third parties and websites taking away the cookies from us by blocking third party cookies in browser security settings - > Block third party cookies and clear cookies demonstrated as a screen share.\nPart 5.1:\nSo, the next time, if you see some cookie boxes asking for your permission to agree, then don't simply agree before you read about their cookie policy and know why and how they use your cookies. \nPart 5.2: We could also install browser extensions such as Privacy Badger or Ghostery. These extensions help by blocking illegimate trackers of information. \n\nPart 6: Cookies are not all bad. They also have simple yet useful functions like remembering your login details for specific websites, like facebook or gmail. So you don't have to enter your login details again every single time. The cookie contains a unique identifier to remember your identity. This is good and it saves a lot of our time.\nPart 7: Eshal: Well the social networking sites then should also know where we live and the shops we visited because Rumansel had her device location turned on while she was looking at her google maps. Probably that's why the other day, there were ads in her facebook showing the best restaurants in Kashmir.\nPart 8: Abida:   A google search, a social media post, online shopping history, a location tracker, a voice message, these are all examples of big data that can be collected online, analyzed and monetized. Because, remember? Machines or computers can be trained to learn patterns from huge amount of data and use algorithms or software to predict who you are and what you will be in the future. Does this mean our privacy will become obsolete with Big Data? Or will it be a progressive step ahead to take informed, safe and more efficient decisions? \n\nAI.S.H.A: Well Abida, I think big data and Artificial Intelligence like me if used well could be of great service to the humanity. Look at me, I'm helping you teach Computer Science in your classroom. There are some of my robot friends who even help disabled people or people with special abilities. And some who help with anxiety and depression too by reading the mind patterns of people. Isn't that amazing?\n\nAbida: Yes AI.S.H.A, looking at robots like you, it seems like there is more hope for AI and machine learning in the future.\n1. Handout: Identify the phishing messages out of the legitimate ones and reason out your choices\n2. Scam emails contain trigger words that trigger a sense of urgency and fear, use manipulative language or claim unbelievable discounts. Sometimes even legitimate emails get tagged as a 'scam' by scam filtering software. This is because these use scam trigger words, spelling errors or bad formatting. Check for the scam folder in your (or parent/gaurdian's) gmail. Are there any scam emails? What kind of emails are in the scam folder? Spot and list the spam triggers\n3. When you are opening a website, both cookies and caches are in action. Open the 'settings' option from any browser that you use and go to 'privacy & security'. You will find an option to clear browsing data with a sub-option to clear cookies vs cached images and files. After clearing both cookies and cache, let's say you are trying to log in to an online shopping site or any account that you are registered with, what effect does clearing a cookie vs clearing a cache will have on your next website browsing experience?
10	L2.C1.v10	Little acts of kindness makes a huge difference	/uploads/submodules/L2.C1.v10.png	Scene 1: \nPart 1: (Yahya, a 12 year old and his mom are on a conversation while having their lunch)\nYahya: Mom, I'm done. I couldn't finish these carrots.\nMom: Yahya, I thought I served you the right portions. Have you ever thought how lucky we are to get to eat food everyday? Wasting food is not only bad for you because you loose energy if you don't eat well, but it's also detrimental to the society. \nYahya: (Insert puzzled look here) Mom, I don't understand. How does me wasting the food affect the society? \nMom: Do you know that there are so many people in the world who are starving every single day because they don't get any food to eat. \nPart 2: More than 33 lakh children in India are malnourished. And because of COVID-19, the situation is even worse. It is tough for some children to get even a single meal per day. \nYahya: (Insert anxious look here) Oh no, that sounds like a nightmare!\nPart 3: Mom: And when you are wasting food, remember that you are also wasting all the energy put into growing, processing and shipping the food which in turn contributes to climate change. That's why we should prefer eating more seasonal fruits and vegetables. Climate change poses so many risks to humans, like frequent storms, flooding and landslides.\nYahya: (Insert anxious look here) Mom, I didn't realize that the food wasted has so many consequences. I truly wish I should do something about the hungry children.
11	L2.C1.v11	Let's solve problems Big or Small - Design thinking approach	/uploads/submodules/L2.C1.v11.png	\n\nEmpathize - Sketch Q&A - Create Story Frames - Create Model - Review & Recreate ---\nScene 1: Part 1: Mom: I'm glad that you are already thinking about solving this problem Yahya. We all can solve problems, Big or Small. Humans are great at Problem Solving, be it on a personal or global level.  We keep solving problems right from the moment we wake up to when we sleep. All you need is a big heart! I will walk you through some of the steps which will help you approach problem solving.\n\nPart 2: \nMom: Step 1: (Empathize) Before solving a problem, the crucial step is to understand what the problem really looks like for the person experiencing it.   This is called empathizing and it is important because no problem is worth solving for, if it's not helping you or others. In your case, since you want to care more about the hungry children, the first step is to meet them in their locality and observe them to know more about their situation. Some ways to empathize are :\n-to listen and observe their body-language, facial expressions and emotions\nAsk questions like "How are you feeling?" so you could understand their feelings better. Remember that different people feel differently about the same problem. The key is to acknowledge it.\n\n[Reference Link]: A handout for the Design thinking steps\nPart 3: \nStep 2:  (Sketch Q&A) Yahya: Mom, I'm just back from having some of the insightful conversations with the children and their families.  \nMom: Good job yahya. \nPart 4: Now that you know how these children and their families are feeling and what their actual needs are, we can move on to step 2 which is to do your own research about the problem and sketch some question and answers. You could sketch these answers in the form of illustrations, drawings and text.  \nHow about we try this now? I will ask you some questions and you will try to get the answers, \nQtn 1: Why is this problem that I'm trying to solve important? in other words why is it important to address malnutrition in India?\nAI.S.H.A: I can help you with some statistics here Yahya:\n- India has made great gains in economic & human development but we are still working hard to reduce hunger.\n- India is home to 1/3 of the world's stunted children \n- 1.27 million children die in India every year due to malnutrition \n- Kashmir alone has reported 15 lakhs of children below 5 years who are acutely malnourished & 29 lakhs of women were anaemic.\n(source, UNICEF 2016)\nPart 5.1: Yahya: Thanks AI.S.H.A, that helps a lot with my research.\nQtn 2: Mom: Let's move on to qtn 2. What impact it would create when malnutrition is solved in children?\nPart 5.2: Yahya: Mom, you used to tell me that there is no food for thought when there is no food for the stomach (show this through drawings/sketches) Improvement in child health is crucial to children reaching their potential and leading a fulfilling life. \nPart 5.3: Mom: Absolutely Yahya. Children below 5 years are more often affected by this problem which leads to wasting (growing thin) & stunting (shorter than normal) in their growth. A child who has anaemia or not enough hemoglobin affects their ability to thrive intellectually. On the other hand, do you know that every 4 seconds a child dies globally because of hunger. This is a serious crisis. \nPart 5.4:\nLet's move on to our next question.\nQtn 3: when and how was the problem created?\nWell mom... I was thinking AI.S.H.A would help me out here with the statistics. But may be she's busy helping some of the other kids out there too. \nLet me see how I can get this information...mmmh, may be google search? . Oh wait, I already got this information when I visited the anganwadi yesterday. Let me check my notes from my observation. \nThere you go, I found it. It looks like the impact of COVID led to disruption of food systems and anganwadi workers were diverted to contact raising, vaccination procedures and financing of nutrition.\nMom: Good job Yahya. India has been facing child malnutrition much before COVID-19 but yes, some of these issues which you found are aggravating the crisis after COVID. \nYahya: And mom, I also heard that because of the school closures, most of the kids have lost their food which they relied on from schools.  \nMom: Well done Yahya, that's a good amount of information to dive into creating your story frames.\n\n[Reference Link]: A handout for Example 1\nPart 6:\nMom: Step 3:  (Story frames) Write as many different story frames as you can for the sketch that you came up with and pick any one story which you think can effectively solve the problem in hand. Examples of story frames to tackle child hunger & malnutrition are, \nStory frame 1 - Making the local community understand the advantages of growing edible gardens \nStory frame 2 - Creating a food resource center with the help of the local council which will involve creating a fortified healthy snack for the children of the community\nMom: Could you think of other story frames, Yahya?\nYahya: Yes mom\nStory frame 3 - I could create a library of resources of the locally available wild edibles and local produce and their medicinal, nutritional values \nStory frame 4 - Or may be a food bank which collects excess food from hotels and weddings and distributes it to malnourished children in need\nPart 7:\nStep 4: (Create)\nMom: That's great . So far so good. Now that we have different story frames, the next step is to choose one of these story frames to solve and 'create' a model for it.\nWhich story frame do you wish to work with Yahya?\nYahya: I wish to work on creating a wild edibles library which will include information about locally available wild edibles and their medicinal/nutritional values. Infact I can make a wild edibles digital library using google slides. I just learnt in my digital literacy lesson on how to make a presentation on any topic. This could serve as my initial model in solving the problem. \nMom: That's a great idea. \nA quick tip Yahya. For your google slides, you could collect data from the local farmers, indigenous people, botanists and physicians and also do a google search to do some relevant research on the local wild edibles. \nYahya: Sure mom, I shall do that!\nPart 8: \nStep 5: (Review & Re-create) \nMom: The most important step is to review your model. You can do this by asking for reviews from the local community that you interviewed. Recreate the model and implement changes whenever necessary.\nYou can also add caveats for specific medical conditions.  For example, children undergoing blood thinning medications cannot eat spinach or edibles that contain higher concentrations of Vitamin K. \nMom: We are done with the five steps for design thinking. How about you try and build your model now, Yahya?\n(Instructor speaking)\nI hope you have got an understanding of how to approach problem solving. here's another example:\nMeet Rani, She is at Patil Nagar, Lane 12, Kashmir.\nRani wants to address the problem of overflowing Garbage from the public dustbin in her community. The dustbin attracts stray animals, flies and rodents and may prove to be a health hazard. Rani decided to work together with her sister and couple of friends to come up with multiple solutions to the problem. \n1. Empathize: They talk to the people in community especially elders and young children who are affected by the problem\n2. Sketch Q&A:  \nQtn 1: What is the problem? Overflowing Garbage\nQtn 2: Why is the problem important?\nRani observed that the garbage spills everytime it's transferred to the municipality truck.\nThe deisgn of the dustbin could be faulty.\nThe dustbin is not detachable and hence not washable.\n\n[Reference Link]: A handout for example 2\nQtn 3: When is this happening? Especially in the evenings\nQtn 4: How does the garbage spill happen? Accumulation of garbage during unloading\n\n3. Story frames:\nStory frame 1: The rectangular design of the dustbin create spills over a larger area. Could a difference in shape cause lower spills?\nStory frame 2: The height of the dustbin was such that the cows could access it easily. While this helps feed the cattle, it was causing more spills in the nearby area. Could dustbins with lid help mitigate this problem? \nStory frame 3: The current dustbin only moves across an axis and can't be removed. Could adding wheels to dustbins and making them detachable solve the problem?\nStory frame 4: Could we replace 1 bin with perhaps 3 to 4 bins per area? Overfilling could be caused by the amount of waste being much larger than the size of the bin. And while we do that could we classify these bins to store different kinds of waste? Could that reduce spills and allow garbage to be more organized for recycling and energy generation? \nStory frame 5: A waste collection audit to find out how often waste gets collected in the bin could identify the frequency of garbage created and negotiate for more frequent collections\n4. Create a model: \nStory frame selected: \n The rectangular design of the dustbin create spills over a larger area. Could a difference in shape cause lower spills? \n- Prepare materials required for prototype (Cardboard, Glue, scissors, papers, etc)\n- Create the cylindrical shape based on the optimum diameter\n- Compare and contrast the cylindrical and rectangular designs\n\n5. Review and Recreate: \nRani reviews and makes changes to her prototype by letting her friends and family test her model with different sample weights. \nRani is really going somewhere with her experiments. She wants to make a positive change in her local community. While we wish her the best, let's meet other problem solvers too.
12	L2.C1.v12	A sneak peak into the wild edibles digital library	/uploads/submodules/L2.C1.v12.png	Part 9: (Yahya shows the google slides he made on wild edibles)\nYahya: Mom, look at the model I created for my digital library on wild edibles. I have collected the data from research papers on wild edibles in Kashmir. I have also interviewed friends, family and people from the community to add inputs to my model. \nPart 10:\n(screensharing)\nI didn't know that there are so many varieties of wild edibles which are abundant sources of vitamins and minerals. These fruits, leaves, seeds and even roots could be a great dietary supplement for children and could reduce the impact of stunting and wasting too.  For example, the Chandheer fruit is a rich source of Vitamin C; a handful of walnuts can provide children with the omega 3 fatty acids that they need for the entire day. The Socchal leaves are a great source of phytonutrients and the mulberry fruit improves digestive health and controls blood sugar levels. And look I have added all the references from which I took up these pictures and information. I'm currently reviewing my model to add tha caveats and implement changes. This should be done soon.   \nPart 11:\nMom: Well done Yahya! Proud of you! You are a design thinker already and you know what it takes to model a specific solution or story frame for a seemingly vast and challenging problem. \nPart 12: \nAbida:  \nWe saw how yahya used a design thinking approach to create a digital library of resources for solving malnutrition in children. \nThere are other examples of solving problems too. \nPart 12.1: Nitya is working on a paper boat that doesn't sink easily while teaching her brother about origami paper folding.\nPart 12.2: Rani wants to address the problem of overflowing Garbage from the public dustbin in her community. She is working on recreating the rectangular shape of the bin which created spills. \n(Use the below pointers for illustration purpose)\n- Prepare materials required for prototype (Cardboard, Glue, scissors, papers, etc)\n- Create the cylindrical shape based on the optimum diameter\n- Compare and contrast the cylindrical and rectangular designs\nPart 12.3: Vishesh wants to amuse his little sister with his problem solving and logical thinking skills. He is working on creating as many objects as he could, using 5 triangles, 2 rectangles and 1 pentagon. \nNow it's your turn. You could be a problem solver too!\nNow it's your turn! You could be a problem solver too. All you need to do is pick a problem close to your heart, empathize, sketch questions, imagine story frames, choose one and create a model to review and recreate a better solution. Record a video discussing about your problem, the steps you followed to arrive at the solution such as the interviews you conducted, the story frames and finally describe the model or prototype that you created.
13	L2.C2.v13	Include, Ignore, Divide and Conquer - The roti making	/uploads/submodules/L2.C2.v13.png	--- Video 13: Include, Ignore, Divide and Conquer - the roti making ---\nScene 1:\nPart 1: Abida: Welcome problem solvers. \nA quick recap - we learnt how to create a working model of the problem that you are trying to solve. We saw how a computer software like google slides can be used to create a model for solving a problem.  Remember our theory from before? Computers and humans make a great team and can prove to be more efficient in solving problems together. But to make the best use of a computer, we humans should learn how to think computationally. \nPart 2:\nWell what is computational thinking? We will get to that part sooner. But before that, I want you to think about some of the simple things that we do every single day. Let's take an example of making a Roti (chapathi). What are the steps involved? \n(Abida's algorithm for making Roti)\n1. Take one cup of Atta (wheat flour) and add a pinch of salt to the Atta \n2. Add water to the dough and knead the dough until it starts to pull together\n3. Make smaller balls out of dough and dust the balls both sides with flour\n4. Roll it until it's evened out in all the sides\n5. Cook the roti on high heat and quickly flip it after 10 seconds on a heated tawa or pan.\n6. Once you see bubbles put the roti directly on fire to puff it up. \nThere you go! The roti is ready to be served\nPart 3: Abida: You can see that these step by step instructions have to be followed in a sequence in the specific order, one after the other to make fluffy perfectly cooked rotis. We call these steps the algorithm. \nPart 4: Include-Ignore: When we write algorithms, we need to ignore the unnecessary details and include only the details that are most relevant to the problem. For example, my algorithm for rotis didn't include details about the color of the container I used or how fast I needed the dough or rolled the rotis. This is not most relevant to making rotis. This process is known as abstraction. \nPart 5: After abstraction, we break down the process into simple steps. This process is known as decomposition. \nWhen we write algorithms for computers, these algorithms have to be precise and accurate if we want the correct results from the computer.  These algorithms are lated translated to code which the computer will run. \nPart 6: For example, meet the world's most popular food robot, the rotimatic. It's a fully automatic roti making machine build by two Indians Pranoti and Rishi - a mechanical engineer and software engineer graduates from the National University of Singapore. Rotimatic has a 32-bit microprocessor (in other words a computer on a single chip) with the CPU processing and control, 10 active motors, 15 smart sensors to sense temperature, position and consistency and 300 parts. \nPart 6: (VE reference: Add clip 7 to 28 s to our video: https://in.video.search.yahoo.com/search/video?fr=mcafee&ei=UTF-8&p=rotimatic+video&type=E210IN826G0#id=3&vid=a691d3c02215855978561deb3b891769&action=click)\nThe rotimatic machine uses an algorithm to make fluffy and nutritritious rotis, 1 roti a minute.  And what more, it uses machine learning to learn more about the doughballs every single time it makes it and uses this information to improve the next doughball. \n\nPart 7: Abida: Now, imagine what happens when the algorithm fed into such a machine is not written in precise order? We can't expect the machine to make fluffy rotis right? Arranging instructions in precise order is called sequencing. Sequencing is crucial to ensure correctness of any algorithm. In the next video we will see another example of an algorithm.
14	L2.C2.v14	Sequencing & Algorithms - The wild edibles app demo	/uploads/submodules/L2.C2.v14.png	--- Video 14: Sequencing & Algorithms - the wild edibles app ---\nScene 2: Part 1: Let's get to another example of an algorithm. Let's say you want to give instructions to someone to draw a square. What would that look like? \nStep 1: Start by facing right and draw a straight line.\nStep 2: Turn 90 degrees right\nStep 3: Draw a straight line\nStep 4: Turn 90 degrees right\nStep 5: Draw a straight line\nStep 6: Turn 90 degrees right\nStep 7: Draw a straight line\nPart 2: That's great. We did draw a square with our algorithm by decomposing it into simple steps to work with, one at a time. \nPart 3: But did the algorithm say how big the square needs to be? Or what color the square needs to be? Yes! these details were ignored or abstracted out so we could write an algorithm which will help make the computer draw a simple square.\nScene 3:\nPart 1: Abida: Let's understand how to think computationally using another familiar example.. Remember Yahya who has created a digital library of wild edibles? He had been trying to address a complex and overwhelming problem of reducing children's hunger and malnutrition. One problem the users might face is not being able to easily search or navigate the slides to find the information about specific wild edibles they might be looking for.  \nA digital application (App) that could deliver the same details on the go could be a handy tool for local people to access and identify information on plants and edibles. \nHere is the challenge for Yahya.\nHow would he know if he has covered all varieties of wild edibles? It's time for Yahya to do some research to aid him in this process. \n\nPart 2: First Yahya recognizes the pattern in which the wild edibles are divided into different types like fruits, leaves, roots and seeds. This technique is called pattern recognition. If Yahya could sort his library in this way, he could ensure he has covered multiple varieties in his app. In addition to that, people using his app would also be able to look for just the edible fruits which could be eaten raw or explicity look for the leaves or seeds. \n\nPart 3: Yahya and his friends work on each plant part first and then group them together to get the complete list of edibles in Kashmir. This method of finding patterns to divide a complex problem into smaller tasks makes the problem easier to solve. It is known as decomposition.\nPart 4: Abida: Are we missing on something? Let's see! There are 1403 wild edible species in India  You see, including all 1403 species seems almost impossible for Yahya and his group now. Yahya ignores details about other cities while he is working to build his app. He only includes information about the wild edibles in Kashmir valley. This allows Yahya's group to abstract away the unnecessary complexity of searching for details about many species at the same time. This is known as abstraction. Yet another important computational thinking skill.\nPart 5: After recognizing the patterns, abstracting out the complex details and decomposing the tasks into subtasks, the next step is to write an algorithm to formulate the solution and carry it out using a computer. Yahya has written his own rules for designing his app. Let's see how he built his app by coding for it. \nYahya used a software called scratch to code for his wild edibles app.\n\nAlgorithm for designing the wild edibles app \n(Screen sharing - wild edibles app)\nStep 1: Design a homescreen for wildedibles in Kashmir\nStep 2: Add buttons to sort the edibles into Fruits, Leaves, Seeds, Root and Flowers\nStep 3: When the Fruits button is clicked, open a new page and add photos of all wild edible fruits in Kashmir with their local name, scientific name and nutritional value. \nStep 4: Add a home button at the top left corner of each page to go back to the home screen\nStep 5: Repeat step 4 for seeds, leaves, roots and flowers\nStep 6: Add a next button to navigate to the next page if there are more than one pages\nPart 6: (Yahya's mom approaches him)\nYahya, I'm so proud of you. It seems to me that you are already close to achieving your goal of helping the hungry children. Every parent can refer to your app for affordable and nutritious sources of food in our loacity.\nPart 7:\nAbida: Now, the great thing about Yahya's app is that, anybody can re-use this design to create a custom wild edibles library of their locality. So his solution can be generalized for similar apps. \n7.2\nIn the last chapter, we learnt about solving problems using a dual approach of design thinking and computational thinking. Design thinking helped in choosing and creating a precise solution from different story frames and computational thinking helped to formulate this solution such that it can be effectively carried out using a computer and later generalized for similar problems.\nIn the next chapter, we will get started with learning to code, so you can create and code solutions to your problems like Yahya did.\nNow it's your turn! Start out by writing algorithms for simple sketches. May be to draw a hexagon or a triangle? Once you get a hang of writing your own algorithm, revisit the model that you have been working on in the previous chapter. Does it seem like a huge problem to explore?  It's time to divide your model into smaller parts to make the model simple to work with. Just like Yahya did. Research more on each part to see if you can find any similar or differentiating patterns. Abstract out the unnecessary complexity and focus on the most relevant parts of the problem. Write an algorithm to use a computer to solve the problem. \n\nHurray!, if you are done with the above steps, then you are ready to get started with coding your algorithms to let the computer do the job for you.
15	L2.C3.v15	Introduction to the scratch coding platform - sprites, costumes and code	/uploads/submodules/L2.C3.v15.png	--- Video 15 Contd : When sprites talk to each other - events and actions ---\nNow that we know about the scratch platform, let's get started by creating our first sprite. Sprites are characters that we will use in our code or program. We could use multiple sprites in our code and each sprite can be coded a different behavior. We could also setup a backdrop to go with the sprites. Meet Bahir, the stag. Stags are endangered species of Red Deer, endemic to Kashmir. It's famous for it's spreading antlers and rich brownish red coat. \nAmara is always fascinated by deers. She finally gets to meet with one of them. \nSprites: Amara & Bahir (from Scratch library)\nBackdrop: Forest (From Scratch library)\nLet's code and visualize how that looks like:\nScene 3: I have chosen a sprite of a girl and named her Amara and placed the sprite in a desired location on the stage. We can adjust the size of each sprite using the size option.\n●  When the green flag is clicked, we want Amara to go to (X: -182, Y: -59). Let's place Bahir at (X: 95, Y: -70) by changing the X and Y co-ordinate of the sprite. \nEvents denote user's interaction with the computer. For example, when you turn on the light switch, the light is ON. When you turn it off, the light is turned OFF. The action of turning ON and OFF the switch is called the event and the light being turned On and OFF is the action. \nSimilarly when Bahir is clicked, as a result of this event, we want him to communicate the message "Hello I'm Bahir, how are you?" The Bahir sprite also broadcasts the message "How are you" and waits. \nWhen Amara sprite receives the message, "How are you", she replies with "Hi Bahir, I'm fine. Nice to meet you". To do this drag the "when sprite receives" event block and the say block from the looks section. \nAlso get the glide block from the motion palette and make Amara glide closer to Bahir. To find out where Amara will glide to, drag the sprite to the exact location and use the glide block with the updated x and y values.\nSimilarly, when the green flag is clicked, we have made Amara go to a specific location on the screen using the go to x and y block. X denotes the horizontal position or X co-ordinate of the sprite and Y denotes the vertical position or Y co-ordinate of the sprite. The center of the stage represents the position (X:0, Y:0). \nWait, looks like there is a problem. Amara replies and then glides closer to Bahir. But it should be the other way. To make him glide first, move the glide block above the say block. Let's check now.\n● We could also set a voice for each of our sprites using the 'set voice to' block and let them speak out loud to each other using the 'speak' block. Note that the text to speech blocks are only available to use with an active internet connection which uses the text-to-speech software provided by Amazon Web Services. This software uses deep learning technology which is a form of machine learning to synthesize natural sounding human speech. Do give it a try!
16	L2.C3.v16	Nature's best algorithms - coding for the metamorphosis	/uploads/submodules/L2.C3.v16.png	--- Video 16: Nature's best algorithms - coding for the metamorphosis ---\nNature has some of the best algorithms of all. The life cycle of an insect - familiarly called as metamorphosis is a great example of a sequence of steps involved in an algorithm. Starting from a egg, the hungry caterpillar eats eats and eats and becomes a big caterpillar, 1000 times it's birth weight. He then builds a small house around himself called a cocoon and pushes his way out into a beautiful butterfly. Algorithm: ● Egg ● Caterpillar or Larva stage ● Pupa or chrysalis stage ● The adult butterfly\nTo code for projects like these, we follow the computational thinking concept called decomposition, i.e to break down the project into simple tasks to work with. Let first select the butterfly sprite and egg sprite. Let's delete the other costume of the egg sprite and place these sprites in the correct position on stage. Since the caterpillar sprite is missing in the sprite library, we will draw a caterpillar sprite. We will use the paint tool to paint our sprite as needed. Similarly we will draw a cocoon sprite and give name to our sprites. We will also select a backdrop for our project.\nNow to the code. When the green flag is clicked, we will let the egg sprite to change costume to egg-a. When green flag is clicked, we need to hide the other sprites. When the egg sprite is clicked, we need to broadcast the message "egg hatched". When the caterpillar sprite receives the message "egg hatched", he needs to show up right next to the egg sprite. For this purpose, we will drag the caterpillar sprite closer to egg and use the go to block to set the caterpillar location. We will set the size to 50% to make the caterpillar look small. Use the glide block to make the caterpillar glide to the left corner and use the change size block to make the caterpillar grow in size. \nWhen the caterpillar sprite is clicked, we broadcast the message, "big fat caterpillar". When the cocoon sprite receives the message "big fat caterpillar", it shows up. \nWhen the cocoon sprite is clicked, we broadcast the message, "cocoon". When the caterpillar sprite receives the message "cocoon", the butterfly shows up. Also when the green flag is clicked we want the butterfly to go to a position near by the cocoon.  When the butterfly is clicked, we want it to glide to the right corner of the screen. Let's check this out now. Wonderful! That works! We have just coded for the metamorphosis.\n(The below script is not included) \nHave you ever thought about how water keeps moving in different ways on, above and below the surface of the earth? Water from the surface of the water bodies evaporates or rises to the air to form water vapour. This process is called evaporation. Due to low temperatures in high altitudes, these vapours become tiny droplets of water and ice forming clouds. This process is known as condensation. When more water droplets merge  together, they fall out of the clouds to the ground as rainfall. This process is known as precipitation. When the air pressure is low or when the weather is too cold, the droplets freeze to form snow. The water from the rainfall flows down to the moutain and hills forming rivers and gets collected in water bodies. This process is known as collection. These sequence of steps are what we call as the water cycle. \nAlgorithm:\n● Evaporation\n● Condensation\n● Precipitation\n● Collection
17	L3.C1.v17	Infinite loops of anger & kindness	/uploads/submodules/L3.C1.v17.png	Scene 1: Part 1:\nIn the last video, we learnt how to code for events and use a broadcast event to code for one of the nature's best algorithms - metamorphosis.  In this video, we will learn about infinite loops and how to code for one in scratch. But first, let's discuss some emotions. Anger is a completely normal human emotion. Infact, scientists like Charles Darwin proposed that animals developed emotions for survival and to prevent themselves from underisable situations. Emotions like disgust for example prevented them from eating food that's bad for them. Fear helped them protect them from predators. But when these emotions go beyond one's control, it consumes us instead of protecting us. \nPart 2: The emotion of anger, for example, when not controlled could extend for a prolonged period of time and cause harmful effects on health, mind and overall quality of life. This is called the infinite loop of anger (Show the infinite loop of anger diagram)\nPart 3: Our planet earth rotates on an infinite loop around the sun. The waterfalls flowing continuously from up above the mountains, our heart beating indefinitely from our mother's womb, jumping on trampolines or even walking are all examples of infinite loops. The same action keep on repeating continuosly. If we were to write an algorithm for walking, then we would put it inside an infinite loop or 'forever loop' which would look like this,\nIn case we want to walk only a specific number of steps, then we will use a repeat block as follows by specifying the number of times to repeat the action.\nNow, let's get to code for an infinite loop. Remember Eshal, the pet sheep of Rumanzel? Eshal gets sad and angry when Rumanzel doesn't feed him on time. When Eshal is angry, his heart races and he goes into an infinite loop of running up and down the living room. Let's see how to code for this in scratch,\nWhen the green flag is clicked, we want Eshal to walk infinitely. To do this, we use the when flag clicked block and the forever block from the control palette.  \nWe will use the 'move steps' block from the 'Motion' section and latch it inside the forever loop. But this will make Eshal walk past the screen. \nTo make him bounce back when he reaches the edge, we use the 'If on edge bounce' block from the motion section. But doing this will make Eshal flip upside down. \nTo correct this, use the set rotation style block from the motions palette and select the rotation style as left-right.\nYou will now see that Eshal doesn't flip upside down but he strides infinitely. This is not good for Eshal. \n\nEscaping from the infinite loop of anger: \nI have created four different sprites for Eshal each representing an emotion - Sad, Angry, Balance and Compassion. To let the sprites communicate with each other, we will use the sending and receiving broadcast events. To show these emotions in a sequence, we will use specific broadcast messages as events to trigger specific emotions. When each sprite is clicked, the sprite communicates it's emotion using the variable 'emotion' whose value keep changing throughout the code. The current emotion is broadcast as a variable and used to trigger the subsequent emotion. Let's divide the code for each sprite and work on one sprite at a time (This is precisely called as decomposition or dividing the problem into smaller tasks to work with and working on one task at a time to later combine the solution for a bigger problem. Even professional coders or programmers today use this technique while working on bigger projects).\nSad Eshal: \n\n ● When green flag is clicked, we want the sad Eshal to show up and say that he's sad. At the same time, we want to hide all other sprites. \n ● Let's also choose a backdrop for our project. \n ● Click on 'Make a variable' from the Variables palette and create a new variable called 'emotion'. (It's a good programming convention to create meaningful variable names. ● Drag the 'set count to 0' block from the variables section. This will initialize the variable value to 0. Initializing means giving a value to the variable. We will initialize the value of emotion variable to 'sad'. As Eshal is initially sad because he is hungry. ● Drag a 'think' block from the 'looks' palette and make Eshal think 'I'm exhausted and hungry' for 3 seconds. Let's check this out. That works. When green flag is clicked, Eshal thinks "I'm exhausted and hungry"\n\nWhen the Eshal sprite is clicked, he needs to say "I am sad". To do this, get the 'when this sprite clicked' block from the events palette. Get the 'say' block from the 'looks' palette. We want Eshal to communicate his emotions whenever we click on him. To do this, get the join block from the 'operators' palette. Write the text "I am" in the space on left. Drag the emotion block from the variables section and put it in the space on the right. ● Make the sad Eshal wait for 3 s before we hide him ● Hide the sprite and broadcast the message "I'm emotion" by placing the join block inside the broadcast block. Join the text "I am" and the variable 'emotion'. When you click on the sad Eshal, he will say "I am sad".\n\nAngry Eshal:\n\n● We want the angry Eshal to show up when he receives the message, "I am sad". Drag the "When I receive" block from the events palette and the show block from the 'looks' palette.\n● Set emotion variable to the value 'angry'.\n● Instead of running into an infinite loop of anger, Eshal needs to stop striding after sometime. To do this, we use a repeat block and set the number to 250. This will make Eshal repeat moving 10 steps for 250 times. He will also bounce if he is touching the edge as we add the if on edge bounce block. \n● When Eshal is clicked, he will say "I am angry". Follow the same procedure to print the emotion variable using the set and join blocks.\n● We want Eshal to take atleast 3 long deep breaths to calm down and communicate with anger. Use the 'think' block from the 'looks' palette to make Eshal say, "Let me take some deep breaths" for 2 seconds and hide the sprite for Angry Eshal. \n● Broadcast the message "I'm emotion" by placing the join block inside the broadcast block. Join the text "I'm" and the variable 'emotion'.\nWe are faced with a similar problem now. The Eshal sprite flips upside down again. Let's fix it by using the set rotation style block again and set it to left-right.\n
18	L3.C1.v18	Emotions are variables	/uploads/submodules/L3.C1.v18.png	Part 1: Think about our emotions. We are not always happy right? Sometimes sad, sometimes angry (just like Eshal), sometimes balanced and other times compassionate. Our emotions keep changing with time. So emotions are nothing but variables. \nPart 2: The weather which changes from rainy to sunny to windy is a variable. \nPart 3: The seasons which change from Spring to Summer to Monsoon to Winter is a variable. \nPart 4: The number of fruits that you can add in your falooda is a variable. It could be apple, banana and pineapple (three). Or if you add mango and grapes (it becomes five). \nPart 5: Eshal's emotions and feelings are variables too. Eshal gets 'sad' when he is hungry. His sadness turns into 'anger'. To prevent himself from getting stuck in the infinite loop of anger, he needs to find 'balance' by communicating with his anger and taking deep breaths from his gut to calm down. Once he reaches 'balance', Eshal will focus on how to be 'compassionate' to others. Let's look at how to code for these emotions using variables.\n\nEshal Balance:\n●  Hide this sprite when the green flag is clicked\n●  When the balance sprite recieves the message, "I'm angry", show the balance sprite and set the emotion variable to "Balance"\n●  When the balance sprite is clicked, say I'm balance using the say block and the join block to join the text and the variable.\n● Use the think block to show the balance sprite thinking "I will find ways to help Rumanzel"\n● Hide the sprite and broadcast the message "I'm emotion" by placing the join block inside the broadcast block. Join the text "I'm" and the variable 'emotion'.\n\nWhen the angry sprite is clicked, we notice that the angry sprite should be hidden. Let's do that before the sprite broadcasts the message.\nEshal Compassion:\n\n●  Hide this sprite when the green flag is clicked\n●  When the balance sprite recieves the message, "I am Balance", show the compassion sprite and set the emotion variable to "Compassion"\n●  When the compassion sprite is clicked, say 'I'm compassion' using the say block and use the join block to join the text and the variable.\n● Use the say block to make the compassion sprite say "Hello Rumanzel. Let me know if I can be of any help with your homework"\n● Hide the sprite and broadcast the message "I am emotion" by placing the join block inside the broadcast block. Join the text "I am" and the variable 'emotion'.\n● When Rumanzel receives the message "I am compassion", she shows up and communicates with Eshal. To do this, use the say block to make Rumanzel say "Sure Eshal. I kept you waiting for long. Let's first go for lunch." We also need to add a backdrop for this.  When the code starts, we need to switch the backdrop to blue sky.\n**Not added** AI.S.H.A: What if we don't use the variable to broadcast the emotion Abida? How would the code look like?\n\nAbida: Great question AI.S.H.A. In this case we would have to broadcast different messages to different sprites which will make the coding process trickier. For example the sad sprite will broadcast the message "I'm sad" inside the broadcast block. The anger sprite will broadcast the message "I'm anger". When a variable is created to store the changing emotions, the computer stores this variable in it's memory and only provides the updated value at any given point. So using a variable makes this process easy and convenient. \n**Not added**\nIn this video we saw how a single variable called 'emotion' took so many different values at different times throughout the code and how it made our code easier to work with. And we also learnt a good strategy to escape from the infinite loop of anger and learn to be more compassionate.\n
19	L3.C1.v19	Catch your thoughts with conditions	/uploads/submodules/L3.C1.v19.png	Part 1: We wrote some code that helped Eshal control his anger and be more compassionate. But wait! Thoughts fuel our emotions and emotions shape our thinking. Thoughts and feelings are closely connected.\nAI.S.H.A: Oh yes Abida. I have some information you would like to know about thoughts. \nThe average person has about 12,000 to 60,000 thoughts per day. Of those, 80% are negative (National Science Foundation, 2005)\nAbida: Absolutely AI.S.H.A. So many negative thoughts, right? Negativity is everywhere! But so is our ability to focus on the positive. If we are able to catch our thoughts and identify them as positive or negative, it becomes easier to consciously choose our emotions. Let's see if we could write some code to catch our thoughts.\n\n(screensharing starts)\nLet's imagine that a thought is like a cloud. It's always passing by. \n● We choose a cloud sprite to represent a thought. Let's duplicate this sprite one for the positive thought and one for negative thought.\nTo mimic that we are catching a thought, let's choose a bucket sprite into which the thought is captured. \n● Let's duplicate this sprite and change the color of the bucket. The blue bucket is to catch a positive thought and the red bucket is to catch a negative thought.\nWhen the green flag is clicked, the cloud sprite asks to "enter your thought?" and waits for your answer. To do this, \n● Use the 'ask and wait' block from the sensing palette and type in the question inside the block.\n● A text box pops up to enter the answer.\n● Once the answer is entered, use the say block from the looks palette to make the cloud say the answer for 2 sec.\n● Show the cloud sprite using the show block from the looks palette and make it go to the specific location on the screen using the go to block from the motion palette.\nLet's check this out. That works!\nLikewise, when the green flag is clicked, the positive cloud and the negative cloud goes to a specific position but is initially hidden.\nNow if a thought is positive, it goes to the positive bucket and if negative, it goes to the negative bucket. \n\nIf the thought is positive such as grateful, then we need to broadcast a positive message. To check if a thought is 'grateful', get the if then block from the control palette and broadcast positive if the condition is true. Similarly check if the thought is 'friendly'. If it is, then broadcast positive again.\nIf the thought is negative such as blaming, then we need to broadcast a negative message. 'Similarly check if the thought is 'bully'. If it is, then broadcast negative again.\nSo the positive cloud needs to show up only when it receives a positive broadcast message and hide when it receives a negative broadcast message.\nThe positive cloud after receiving the message also changes it's size by -50 and glides towards the blue bucket, i.e takeout. If the positive cloud touches the blue bucket, it must hide. To do this we use the if then block from the control palette.\nFor the negative cloud, we repeat the same steps as the positive cloud. \nAlso it's a good practice to add comments to your code to make it more understandable. Code to catch thoughts, code that receives positive thoughts and code that recieves negative thoughts\nLet's check if this is working! Positive thoughts like grateful go to the positive bucket and negative thoughts go to the negative bucket. Glad! That works!\nWe are processing conditions literally in every part of our daily lives, not just to catch thoughts. Some basic examples of If conditions are,\n● If you go out\n      wear a mask\n● If it is rainy\n      take an umberella\n● If you are hungry\n      have some food\n● If it is winter\n      wear a hoodie \n\nIf conditions either return the output as 'true' or it returns the output as 'false'. This type of output is called as boolean since it can only have two possible outputs.\nAI.S.H.A: Wow Abida, we process so many conditions in a single day. But you got me thinking. Let's say I wish to write the code to classify people into different generations based on their age groups, do I have to write many 'If blocks' to achieve this? There would be lots of conditions to check for each person.\nIf age = 10 to 25\n    Gen Z\nIf age = 26 to 41\n    Millenials\nIf age = 42 to 57\n    Gen X\nIf age = 58 to 76\n    Baby boomers\nIf age = 77 to 94\n    Silent generation\nAbida: Great question AI.S.H.A. And hey, I could see your tone of voice has improved too. \nAI.S.H.A: Thanks Abida. I have been learning a lot from the way you speak. As an A.I, that's what I'm good at. And what not, we have been doing more lessons on emotions and thoughts recently. I've been recently working on them too. Do I sound more like a human?\nAbida: (Giving a puzzled look) Well, looks like you are getting closer)\nOkay, let's see. You have come up with a great example for if conditions. But not every time each and every condition needs to be checked. For example, a single person cant be of age 11 and age 57 at the same time (unless you are time travelling). So it's not useful to check all those if conditions at the same time. Only one condition could be true for a single person. In this case, instead of using a 'if condition', we could use an 'else-if' condition,\nIf age = 10 to 25\n    Gen Z\nelse If age = 26 to 41\n    Millenials\nelse If age = 42 to 57\n    Gen X\nelse If age = 58 to 76\n    Baby boomers\nelse\n    Silent generation\n\nIn this case, only the first if block needs to be checked always. If this condition is false, only then the proceeding else-if blocks are checked. If none of the else-if conditions are true, then the else block is executed. \nIn our case we could translate the code to something like this using the if-else ladder\n
20	L3.C1.v20	Binary thoughts and boolean logic	/uploads/submodules/L3.C1.v20.png	Let's look at the sentence: "When Rumansel walks past the dessert shop or a restuarant and if it's not raining, she will buy a falooda". It might look like a simple sentence. But when a computer reads it, it will try to evaluate this sentence using only 0's and 1's as inputs and produce an output that is equal to a 0 or a 1. Let's decompose this sentence into different parts and access each simple sentence\ni) When Rumansel walks past the dessert shop \nor  (any one statement must evaluate to true or 1)\nii) a restuarant \nand (both statements must evaluate to true or 1)\niii) it's not raining - (The negation must evaluate to true or 1)\nLet's look at the possibilities hidden in this sentence to check the outcome of the statements using binary logic: \n● Rumanzel walks past the dessert shop (1) or restaurant (0) and if it's not raining (1), she will buy a falooda (output is true or 1) \n1 or 0 = 1 and 1 = 1\n● Rumanzel walks past the dessert shop (0) or restaurant (1) and if it's not raining (0), she will buy a falooda (output is false or 0)\n0 or 1 = 1 and 0 = 0\nExercises for students to try:\n● Rumanzel walks past the dessert shop (0) or restaurant (1) and if it's not raining (1), she will buy a falooda (output is true or 1)\n0 or 1 = 1 and 1 = 1\n● Rumanzel walks past the dessert shop (1) or restaurant (0) and if it's not raining (0), she will buy a falooda (output is false or 0)\n1 or 0 = 1 and 0 = 0\n● Rumanzel walks past the dessert shop (0) or restaurant (0) and if it's not raining (1), she will buy a falooda (output is false or 0)\n0 or 0 = 0 and 1 = 0\n● Rumanzel walks past the dessert shop (0) or restaurant (0) and if it's not raining (0), she will buy a falooda (output is false or 0)\nSimilarly, out of the 60,000 thoughts an average human thinks per day, some are postive and the rest are negative. Instead of checking each thought with an 'if statement', we could check for example if a thought is friendly or grateful or peaceful using a single 'if condition' connected with 'or' statements. So the code we wrote above will translate to:\nNow we have a simple if and else-if condition to check for all four thoughts. Do you also notice that the size of the code has reduced subsequently by coding for the 'or' condition? Through this we also learn that there could be more than one way of coding to achieve the same logic or result. Thr trick is to go for the most efficient way. For example, in this case, we prioritized writing shorter code which checks for as few conditions as possible.\n
21	L3.C2.v21	Let's karaoke	/uploads/submodules/L3.C2.v21.png	2. Can we create some music aswell using our code? Let's try!\nAISHA do you remember the computer song that we wrote together the other day? What if we could code for a Karaoke for this song? \n3. AISHA: Oh how could I forget the computer song!\nFirst we need to create some karaoke tunes for this song. Let's see how to do this. First we will create music for stanza 1.\nThere are 12 beats in first stanza.\nThen we will create music for stanza2. Stanza 2 has 6 notes repeating twice for 2 lines. These 2 lines repeat together one more time. In this case, we will need a nested loop for the second stanza, like the one shown below\nWe will then proceed with the last stanza same way\nWait, to test if the second stanza is working properly, we should have to wait for the first stanza to get over. And for the third, we need to wait for both second and first to complete. Can we do something to test for the 2nd stanza without having to wait for the previous one? Yes we have a way to divide this code into modules or functions to avoid the complexity of working with huge blocks of code. In this case, we can write different functions for each stanza and call that function separately to test our code. Just like this.\nOnce we defined all three functions to play music for the three stanzas, we define another function called 'play music' which calls for functions stanza1, stanza2 and stanza3 music. To call a function we use the function name block shown in pink.  We then use a repeat block to repeat the entire music twice resting for 0.5 beats in between.\nSee how functions make the code modular and easy to work with? Now let's say if somebody else wants to add more lyrics to the song and create karaoke for the same. They could perhaps find a way to reuse the tones and notes that we have created and the functions that we have written are greatly helping for modifying and reusing parts of the code.\nNow that we have music, we want to guide people to sing along just like in the karaokes. Let's introduce an arrow sprite for this and make it move in sync with the notes.\nNow that we have learnt a easy way to code and check for each of our music stanza's we can build our code for the arrow movement the same way. One stanza at a time and one separate function for each stanza like this and call a single function for moving the arrow for all three stanzas.\nUp next is another interesting visualization. Let's consider that we are in a fairy tale world for now and let's say that for every stanza or line that is repeated, two flowers bloom in the garden right next to each other. Let's code for this now.\n
22	L3.C2.v22	Funny face filters	/uploads/submodules/L3.C2.v22.png	Wow, that was intense. We wrote a program to create a karaoke and visualize loops and nested loops by coding using many functions or modules. Let's code for a simple yet fun project now - face filters. Let's see how this works.\nI'm first going to draw some accessories to be able to use them in my face filter project. Let's draw some cool eye glasses first. Then a jokers hat, a jungle hat and moustache and some beautiful jewelry.\nNow that we got all our costumes drawn, we are going to use the video sensing extension from scratch to turn the video on. When the green flag is clicked, the video is turned on. Now all we have to do is try our first face effect. Let's see. But we have a problem, we want to try all the face effects we made. How could we do that? \nIt's time to recall our past lesson on events and actions.\nWe want these costumes to change automatically by sensing our motion. We can use the video motion on sprite block to sense the video motion if it's greater than 50. If so we keep changing costume every 3 seconds.  To do this get the forever block from the control palette and use next costume block to change the costume waiting for  3 seconds.\n
23	L3.C2.v23	Let's summon some magic patterns	/uploads/submodules/L3.C2.v23.png	Part 1: Abida: In the past videos, we wrote algorithms to draw geometric shapes like squares. How about we write some code now to draw different geometric patterns just as we tap on the screen? We will create three shapes - triangle, square and hexagon. Let's work on these shapes one at a time. \n\nTo draw a shape, we need the length of each line of the shape and the angle of rotation. The angle of rotation is 360 degrees/no of edges. If it's a square, it's 360/4. If it's a triangle, it's 360/3. For a hexagon, it is 360/6. Alright, we know how to draw these shapes. But how do we draw a different shape everytime we tap on the screen? Just like this? \nTriangle Square Hexagon \nTriangle Square Hexagon \n\nAnd how do we automate this process through our code such that if someone else wants to draw a different shape, they can still achieve this with our code with minor changes. Let's see how?  \n\nPart 2: That was fun. Now, what if we could summon some magic patterns when we tap on the screen using the same logic? This time, may be a \nsnowflake, a honeycomb, Kite (saw it out loud)\nsnowflake, a honeycomb, Kite (just do actions)\nsnowflake, a honeycomb, Kite (just do actions)\nLet's create some patterns with shapes part 1 (Start to 1.17s) Let's first try drawing a square by replacing the sprite. We will use the pen extension to draw our shapes. When the pen is down, we draw the shape (30 s)\n(1.17 to 6.14s) As we discussed, we could draw different shapes by changing the edge value. (30s)\n(6.08 to 6.58s) Instead of changing these values every single time, what if we could automate this process. First, I want to be able to draw any shape by re-using the logic that we just wrote. Writing functions are a great way to re-use our code. So let's write a function called drawShape. What if I want to draw a shape of any length? In this case, we can create a function with parameter or input called 'length' and define the function. (30s)\n\n(7.24s to 11.08s) But wait, we didn't mention when to draw a square or a triangle or hexagon when we tap on the screen. To do this, let's create another function called chooseShape which automates this process. This function defines that if it's the first tap, i.e if count variable =1, then we draw a triangle, 2 a square and 3 a hexagon. Since we will keep up incrementing the count value, a count of four will reset to 1 and set the edge as 3  (30s)\n\n\n(11.41s to 15.15s) Now when the green flag is clicked, we erase everything from the last run, we initialize the count to 1 and use a forever block to check for a full tap, i.e when the mouse or your finger touches the screen, the shape is drawn. We also call the choose shape function we defined before to choose the shape to draw and play a pop sound as we draw. Let's check if it works so far. We have a problem. \n\n(15.16s to 16.50s) We need to make the pen go up after drawing every shape until the next tap. Let's fix this. That works! \n\n(16.51s to end) But we still don't get different shapes. Let's see what we are missing. There we go, this is because we haven't changed the count variable by 1. Also let's set the pen color and try tapping our shapes.\nWhen green flag is clicked, we first choose the shape, pen down, wait for a full mouse click or a tap and go to the mouse pointer. The next step is to call the draw shape function and then we are done.\nWe need these patterns to appear only when we tap on the screen. And how do we know which pattern should be drawn upon tapping on the screen. We want these patterns to appear exactly in the same order everytime. First the triangle, then the square and then on the third tap we want the hexagon. How could we achieve this? We can write a function which initially chooses which shape to draw. If it's the first time we are tapping on the stage, we draw a triangle, second time square and so on. And if the count reaches 4, we reset the count and start drawing a triangle again.\nLet's try and create some magic patterns with the same logic. First we create a function to choose the pattern based on the tap count.\nWe then define functions to specify the characteristic of each magic pattern. For example, a value of (4,150, 30) for the (edge, angle, length). If it's the first time the screen is tapped or at the first instance of the mouse click, a snowflake should be summoned. We set the pen color to be white. Similarly we define other two functions honeycomb and kite.  \nOnce we choose the shape to draw and define the characteristics of a pattern, we need to draw the pattern. So we define a draw pattern function which will draw the shape.  We create clones corresponding to number of edges and draw a pattern of specific length. And then we create clones for each clone turning at specific angles and drawing patterns, extending this for 5 levels. After every pattern is drawn, we delete the clones for that pattern to make sure we don't run out of clones in scratch. There we go, let's check this out! We got a beautiful pattern of snowflake, honeycomb and kite. And we could repeat this forever to create something that looks like a wallpaper.\n
24	L3.C3.v24	Code for the net-zero - Planting Trees	/uploads/submodules/L3.C3.v24.png	That's nice. We simulated planting some trees. A great step ahead in creating awareness about global warming.  \nHow about we also simulate how these trees help with reducing the climate change? Trees absorb carbon-di-oxide from the atmosphere to make their food and are later converted into wood and buried deep in the ground through the roots. These roots can later be converted into charcoal which is a stable form of carbon which doesn't easily release into the air. This is commonly known as natural sequestration.\nOther artificial way of achieving sequestration is by absorbing carbon from the atmosphere and storing it underground. Let's see how to code for carbon sequestration.\n\nAbida: We have so far coded for some of the things that we love doing and are passionate about. How about coding for something the world needs the most?\nAI.S.H.A: There are more pressing issues in today's world. One of the problems that I could think of over the last decade is Global warming - Melting glaciers, dying animals and plants, snow storms and extreme weather conditions. The global warming effect is caused by harmful gases mostly carbon which traps heat from the sun and stops it from leaving our earth's atmosphere. Do you think we could do anything about this Abida?\nAbida: You are right AI.S.H.A. We all can do our part in reducing the effects of climate change. Little things like turning off the lights when not in use, reducing food waste and planting more trees can help in removing the same amount of carbon-di-oxide which is being released into our atmosphere. This is known as achieving net-zero emissions. How about we code to create some awareness about the net zero and global warming?\nAISHA: Smoke and pollutants from industries and vehicles produce carbon (gases like carbon di-oxide and carbon monoxide which gets trapped in the earth's atmosphere. Our planet earth is literally on fire and couldn't bear with the heat anymore. Could we do a simulation to blow off this heat?\n\nTo do this, once we create the sprites, we simple blow off the heat by blowing into our microphone. If the loudness level is above a certain level, the fire sprite should start shrinking and then disappear when it's size is less than 5. Once the fire sprites disappears, we have our earth happy and smiling.\nCould we do an illustration to visualize this? \nWe will first create all the sprites. The earth sprite which looks sad, the fire sprite, the building and the car and a sprite of tree which is half cut.\nwhen we click on earth, we could plant trees by simply tapping or clicking on the stage. Let's see how we could achieve this.\n
\.


--
-- Data for Name: concepts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.concepts (id, submodule_id, concept_name, ct_concepts, description) FROM stdin;
1	1	Core Function of a Computer	{"A computer is a complex system of interconnected parts designed to process information and execute tasks efficiently. The lesson uses a cooking analogy to introduce how different components work together to achieve an overall goal."}	A computer is a complex system of interconnected parts designed to process information and execute tasks efficiently. The lesson uses a cooking analogy to introduce how different components work together to achieve an overall goal.
2	1	Central Processing Unit (CPU) Role	{"The CPU, depicted as the 'master chef,' is the brain of the computer, responsible for executing instructions, performing calculations, and controlling other hardware components. It handles the core computational and logical operations."}	The CPU, depicted as the 'master chef,' is the brain of the computer, responsible for executing instructions, performing calculations, and controlling other hardware components. It handles the core computational and logical operations.
3	1	Random Access Memory (RAM) Function	{"RAM acts as the computer's short-term memory, holding data and program instructions that the CPU needs to access quickly. It is like a recipe book that is open and readily available to the master chef but has limited space."}	RAM acts as the computer's short-term memory, holding data and program instructions that the CPU needs to access quickly. It is like a recipe book that is open and readily available to the master chef but has limited space.
4	1	Operating System (OS) as a Manager	{"The OS, personified as the 'sous-chef,' enables the CPU to manage and switch between multiple tasks (or 'recipes') simultaneously without confusion. It oversees the overall flow of operations and resources within the computer."}	The OS, personified as the 'sous-chef,' enables the CPU to manage and switch between multiple tasks (or 'recipes') simultaneously without confusion. It oversees the overall flow of operations and resources within the computer.
5	1	Cache Memory for Speed Optimization	{"Cache memory, the 'superwoman,' stores frequently used data and instructions in a very fast, small memory located close to the CPU. This allows the CPU to access crucial information almost instantly, reducing wait times."}	Cache memory, the 'superwoman,' stores frequently used data and instructions in a very fast, small memory located close to the CPU. This allows the CPU to access crucial information almost instantly, reducing wait times.
6	1	Graphics Processing Unit (GPU) Specialization	{"The GPU, represented by a character specializing in 'plating and presentation,' is a dedicated processor designed to handle visual computations. It is crucial for rendering graphics, videos, and complex visual data quickly and efficiently."}	The GPU, represented by a character specializing in 'plating and presentation,' is a dedicated processor designed to handle visual computations. It is crucial for rendering graphics, videos, and complex visual data quickly and efficiently.
7	1	Persistent Storage (Drive) vs. Temporary Memory	{"The Drive serves as the computer's long-term storage, capable of holding vast amounts of data like photos and documents persistently, even when the computer is off. It contrasts with RAM, which is faster but temporary and limited in capacity."}	The Drive serves as the computer's long-term storage, capable of holding vast amounts of data like photos and documents persistently, even when the computer is off. It contrasts with RAM, which is faster but temporary and limited in capacity.
8	1	Interdependency of Computer Components	{"The lesson emphasizes that all computer hardware components work together as a cohesive team, each with specialized roles. No single component can perform all tasks effectively, highlighting the importance of system integration."}	The lesson emphasizes that all computer hardware components work together as a cohesive team, each with specialized roles. No single component can perform all tasks effectively, highlighting the importance of system integration.
9	1	Trade-offs in Hardware Design (Speed vs. Capacity)	{"The comparison between RAM (fast, limited) and Drive (slower, high capacity) illustrates that computer hardware involves trade-offs. Different components are optimized for specific purposes, balancing factors like speed, storage size, and cost."}	The comparison between RAM (fast, limited) and Drive (slower, high capacity) illustrates that computer hardware involves trade-offs. Different components are optimized for specific purposes, balancing factors like speed, storage size, and cost.
10	1	Analogies as Learning Tools	{"The 'cooking story' analogy is used to simplify complex technical concepts about computer hardware into relatable everyday experiences. This demonstrates how analogies can make abstract ideas more accessible and easier to understand."}	The 'cooking story' analogy is used to simplify complex technical concepts about computer hardware into relatable everyday experiences. This demonstrates how analogies can make abstract ideas more accessible and easier to understand.
11	1	Introduction to Computer Science	{"The video implicitly defines computer science by differentiating it from other academic subjects like biology, physics, or art. It sets the stage for understanding computer science as a distinct field focused on computational thinking and technology."}	The video implicitly defines computer science by differentiating it from other academic subjects like biology, physics, or art. It sets the stage for understanding computer science as a distinct field focused on computational thinking and technology.
12	2	Computer Hardware	{"Hardware refers to the physical, tangible components of a computer system that you can see and touch. These parts are essential for the computer's operation and include input devices like keyboards, output devices like monitors, and internal components such as the CPU and memory."}	Hardware refers to the physical, tangible components of a computer system that you can see and touch. These parts are essential for the computer's operation and include input devices like keyboards, output devices like monitors, and internal components such as the CPU and memory.
13	2	Computer Software	{"Software refers to the intangible instructions, programs, and data that tell the hardware what to do. Unlike hardware, you cannot physically touch software, but you interact with it through applications, operating systems, and games displayed on a screen."}	Software refers to the intangible instructions, programs, and data that tell the hardware what to do. Unlike hardware, you cannot physically touch software, but you interact with it through applications, operating systems, and games displayed on a screen.
75	6	Server (Networking)	{"A server is a powerful computer on the internet that stores data and responds to requests made by clients. When a client requests information, the server processes the request and sends back the appropriate data."}	A server is a powerful computer on the internet that stores data and responds to requests made by clients. When a client requests information, the server processes the request and sends back the appropriate data.
14	2	Binary (Machine Language)	{"Binary is a computer's native language, representing all software instructions and data using only two symbols: 0 and 1. This 'machine language' is the basic form into which all higher-level code is converted for the computer's CPU to understand and execute."}	Binary is a computer's native language, representing all software instructions and data using only two symbols: 0 and 1. This 'machine language' is the basic form into which all higher-level code is converted for the computer's CPU to understand and execute.
15	2	Central Processing Unit (CPU)	{"The CPU, or Central Processing Unit, is often called the 'brain' of the computer. It performs all arithmetic and logic operations, processes instructions, and controls the flow of information between all other computer components."}	The CPU, or Central Processing Unit, is often called the 'brain' of the computer. It performs all arithmetic and logic operations, processes instructions, and controls the flow of information between all other computer components.
16	2	Random Access Memory (RAM)	{"RAM is the primary, main memory of a computer where the CPU temporarily stores instructions and data it is actively working on. It acts as a fast workspace, allowing quick access to information needed for current tasks, similar to a chef's cutting board."}	RAM is the primary, main memory of a computer where the CPU temporarily stores instructions and data it is actively working on. It acts as a fast workspace, allowing quick access to information needed for current tasks, similar to a chef's cutting board.
17	2	Volatility of RAM	{"RAM is a type of volatile memory, meaning that any data or instructions stored within it are lost as soon as the computer's power supply is turned off. This temporary nature makes RAM ideal for active work, but not for long-term storage."}	RAM is a type of volatile memory, meaning that any data or instructions stored within it are lost as soon as the computer's power supply is turned off. This temporary nature makes RAM ideal for active work, but not for long-term storage.
18	2	Data Storage Units	{"Computer memory capacity is measured using specific units, starting with a bit (binary digit, 0 or 1) as the smallest unit. Eight bits form a byte, which can store a single character, and larger units like Gigabytes (GB) represent billions of bytes."}	Computer memory capacity is measured using specific units, starting with a bit (binary digit, 0 or 1) as the smallest unit. Eight bits form a byte, which can store a single character, and larger units like Gigabytes (GB) represent billions of bytes.
19	2	Read Only Memory (ROM) and BIOS	{"ROM is a type of permanent memory where data is written once and can be read multiple times, persisting even when the power is off. It stores essential instructions, such as the Basic Input Output System (BIOS), which helps the computer start up and load the operating system."}	ROM is a type of permanent memory where data is written once and can be read multiple times, persisting even when the power is off. It stores essential instructions, such as the Basic Input Output System (BIOS), which helps the computer start up and load the operating system.
20	2	Operating System (OS)	{"The Operating System (OS) is crucial software that manages all hardware and software resources, acting as a bridge between applications and the computer's physical components. It allocates memory, schedules tasks for the CPU, and provides a user interface for interaction."}	The Operating System (OS) is crucial software that manages all hardware and software resources, acting as a bridge between applications and the computer's physical components. It allocates memory, schedules tasks for the CPU, and provides a user interface for interaction.
21	2	Cache Memory	{"Cache memory is a small, very fast memory integrated into or near the CPU, used to store frequently accessed instructions and data. It helps the CPU access information much quicker than retrieving it from main memory (RAM), reducing processing time."}	Cache memory is a small, very fast memory integrated into or near the CPU, used to store frequently accessed instructions and data. It helps the CPU access information much quicker than retrieving it from main memory (RAM), reducing processing time.
22	2	Graphics Processing Unit (GPU)	{"A GPU is a specialized electronic circuit designed to rapidly manipulate and alter memory to accelerate the creation of images, videos, and animations. It works alongside the CPU to handle computationally intensive graphical tasks, making games and visual applications run smoothly."}	A GPU is a specialized electronic circuit designed to rapidly manipulate and alter memory to accelerate the creation of images, videos, and animations. It works alongside the CPU to handle computationally intensive graphical tasks, making games and visual applications run smoothly.
23	2	Secondary Storage (Drives)	{"Secondary storage refers to permanent data storage devices in a computer, like hard disk drives or solid-state drives, used for storing large amounts of files and programs. Unlike RAM, data on secondary storage persists even after the computer is turned off, providing long-term data retention."}	Secondary storage refers to permanent data storage devices in a computer, like hard disk drives or solid-state drives, used for storing large amounts of files and programs. Unlike RAM, data on secondary storage persists even after the computer is turned off, providing long-term data retention.
24	2	Hard Disk Drives (HDD) vs. Solid State Drives (SSD)	{"HDDs store data magnetically on spinning platters using a read/write head, making them slower due to mechanical parts. SSDs, conversely, use flash memory, offering significantly faster data access times and greater durability as they have no moving parts."}	HDDs store data magnetically on spinning platters using a read/write head, making them slower due to mechanical parts. SSDs, conversely, use flash memory, offering significantly faster data access times and greater durability as they have no moving parts.
25	2	Instructions and Data in Memory	{"Computer memory, like RAM, stores both the step-by-step commands (instructions) that make up a program and the actual values (data) that those instructions operate on. The provided image illustrates this by showing Scratch-like blocks as instructions and variable values as data stored in memory."}	Computer memory, like RAM, stores both the step-by-step commands (instructions) that make up a program and the actual values (data) that those instructions operate on. The provided image illustrates this by showing Scratch-like blocks as instructions and variable values as data stored in memory.
89	7	Online Content Creation and Sharing	{"Refers to the act of generating and sharing original content, such as a poem or presentation, on digital platforms. It implicitly touches on the vulnerability associated with sharing creative work online and the potential for public reaction."}	Refers to the act of generating and sharing original content, such as a poem or presentation, on digital platforms. It implicitly touches on the vulnerability associated with sharing creative work online and the potential for public reaction.
26	3	Input-Process-Output (IPO) Model	{"The fundamental framework describing how all computing machines operate. It outlines the three sequential stages: data is received (Input), manipulated or calculated (Process), and then presented as a result (Output). This model is a core concept in understanding computational thinking."}	The fundamental framework describing how all computing machines operate. It outlines the three sequential stages: data is received (Input), manipulated or calculated (Process), and then presented as a result (Output). This model is a core concept in understanding computational thinking.
27	3	Input Devices	{"Hardware components that provide data and instructions to a computer system. These can range from manual entry tools like a keyboard and mouse to automated data collectors such as various types of sensors that detect real-world conditions."}	Hardware components that provide data and instructions to a computer system. These can range from manual entry tools like a keyboard and mouse to automated data collectors such as various types of sensors that detect real-world conditions.
28	3	Output Devices	{"Hardware components that communicate the results of a computer's processing to the user or to another system. This can involve displaying information on a screen, printing documents, or physical actions performed by actuators."}	Hardware components that communicate the results of a computer's processing to the user or to another system. This can involve displaying information on a screen, printing documents, or physical actions performed by actuators.
29	3	Sensors	{"Specialized input devices that detect and measure physical properties or conditions from the real world, such as temperature, pressure, light, or sound. Sensors translate these real-world phenomena into digital data that a computer can interpret and use."}	Specialized input devices that detect and measure physical properties or conditions from the real world, such as temperature, pressure, light, or sound. Sensors translate these real-world phenomena into digital data that a computer can interpret and use.
30	3	Actuators	{"Specialized output devices that convert electrical signals from a computer into physical motion or action. Actuators enable computers to interact with their physical environment by performing tasks like sounding an alarm, moving a robotic arm, or controlling vehicle steering."}	Specialized output devices that convert electrical signals from a computer into physical motion or action. Actuators enable computers to interact with their physical environment by performing tasks like sounding an alarm, moving a robotic arm, or controlling vehicle steering.
31	3	Real-World Data Sensing	{"The ability of computer systems, through their sensors, to gather diverse types of information directly from their surroundings. This includes detecting various environmental parameters like temperature, smoke, touch, speed, and direction, which is then fed into the system for processing."}	The ability of computer systems, through their sensors, to gather diverse types of information directly from their surroundings. This includes detecting various environmental parameters like temperature, smoke, touch, speed, and direction, which is then fed into the system for processing.
32	3	Embedded Computers	{"Small, specialized computer systems integrated within larger products or machines to perform dedicated control functions. Unlike general-purpose computers, they are designed for specific tasks and may not possess all the typical hardware components, yet they still operate using the IPO model."}	Small, specialized computer systems integrated within larger products or machines to perform dedicated control functions. Unlike general-purpose computers, they are designed for specific tasks and may not possess all the typical hardware components, yet they still operate using the IPO model.
33	3	Computer Dependence on Human Instructions	{"A foundational principle in computing that highlights how computers, despite their speed, cannot think or make decisions independently. They require precise, step-by-step instructions (programs) and relevant data provided by humans to accomplish any task."}	A foundational principle in computing that highlights how computers, despite their speed, cannot think or make decisions independently. They require precise, step-by-step instructions (programs) and relevant data provided by humans to accomplish any task.
34	3	The 'Process' Stage in IPO	{"The core operational stage within the Input-Process-Output model where the computer performs computations, manipulations, or transformations on the received input data. This internal work converts raw data into meaningful information or actions according to the programmed instructions."}	The core operational stage within the Input-Process-Output model where the computer performs computations, manipulations, or transformations on the received input data. This internal work converts raw data into meaningful information or actions according to the programmed instructions.
35	3	Human Role in Programming and Data Provision	{"The essential function of humans in creating the detailed instructions (programs or 'recipes') and supplying the necessary initial data for a computer to execute. Without human input in this form, a computer would not be able to function or achieve any desired outcome."}	The essential function of humans in creating the detailed instructions (programs or 'recipes') and supplying the necessary initial data for a computer to execute. Without human input in this form, a computer would not be able to function or achieve any desired outcome.
36	3	Examples of Specific Input Devices	{"Concrete examples of devices that serve as entry points for data into a computer system. These include familiar tools like a keyboard and mouse for user input, and specialized sensors such as infrared temperature sensors or proximity sensors for automatic data collection."}	Concrete examples of devices that serve as entry points for data into a computer system. These include familiar tools like a keyboard and mouse for user input, and specialized sensors such as infrared temperature sensors or proximity sensors for automatic data collection.
37	3	Examples of Specific Output Devices	{"Concrete examples of devices that display or perform actions based on a computer's processed information. This category covers a wide range from visual displays like a monitor screen or printed paper, to physical actions such as sounding an alarm or controlling a robotic arm."}	Concrete examples of devices that display or perform actions based on a computer's processed information. This category covers a wide range from visual displays like a monitor screen or printed paper, to physical actions such as sounding an alarm or controlling a robotic arm.
129	11	Problem Solving Fundamentals	{"Introduces the idea that everyone can solve problems, whether big or small, emphasizing that it's a continuous human activity. This concept lays the groundwork for approaching challenges systematically."}	Introduces the idea that everyone can solve problems, whether big or small, emphasizing that it's a continuous human activity. This concept lays the groundwork for approaching challenges systematically.
38	4	Human vs. Computer Capabilities	{"Computers excel at processing and remembering vast amounts of information and performing repetitive tasks quickly. Humans possess emotional intelligence, creativity, and the ability to identify complex patterns intuitively, highlighting their complementary strengths."}	Computers excel at processing and remembering vast amounts of information and performing repetitive tasks quickly. Humans possess emotional intelligence, creativity, and the ability to identify complex patterns intuitively, highlighting their complementary strengths.
39	4	Artificial Intelligence (AI) Introduction	{"Artificial Intelligence (AI) refers to the capability of machines to simulate human-like intelligence, such as learning, problem-solving, and decision-making. The character AI.S.H.A is introduced as an example of an AI designed to learn and teach."}	Artificial Intelligence (AI) refers to the capability of machines to simulate human-like intelligence, such as learning, problem-solving, and decision-making. The character AI.S.H.A is introduced as an example of an AI designed to learn and teach.
40	4	Real-world Applications of AI/Robotics	{"AI and robotics can address significant real-world challenges, such as automating apple harvesting to overcome adverse weather conditions, pandemics, or labor shortages. This demonstrates how technology can improve efficiency and resilience in industries like agriculture."}	AI and robotics can address significant real-world challenges, such as automating apple harvesting to overcome adverse weather conditions, pandemics, or labor shortages. This demonstrates how technology can improve efficiency and resilience in industries like agriculture.
41	4	Computer Pattern Recognition	{"Computers learn to identify objects by observing and analyzing various images to recognize common characteristics and patterns. By detecting similarities and differences (e.g., color, shape, size), machines can distinguish between different objects."}	Computers learn to identify objects by observing and analyzing various images to recognize common characteristics and patterns. By detecting similarities and differences (e.g., color, shape, size), machines can distinguish between different objects.
42	4	Machine Training Process (Classification)	{"Training a machine involves showing it many examples and explicitly classifying or 'tagging' each example. For instance, images are labeled as 'apple' or 'not apple' so the computer learns to associate specific features with a category."}	Training a machine involves showing it many examples and explicitly classifying or 'tagging' each example. For instance, images are labeled as 'apple' or 'not apple' so the computer learns to associate specific features with a category.
43	4	Training Data	{"Training data is the collection of information (like images with labels) fed to a machine to help it learn. The quality and quantity of this data are crucial for the machine to develop accurate and reliable decision-making abilities."}	Training data is the collection of information (like images with labels) fed to a machine to help it learn. The quality and quantity of this data are crucial for the machine to develop accurate and reliable decision-making abilities.
44	4	Iterative Learning in Machines	{"Machines, similar to humans, learn through an iterative process of trial and error. They make initial guesses, learn from their mistakes by processing more data, and continuously refine their understanding until they can perform tasks accurately."}	Machines, similar to humans, learn through an iterative process of trial and error. They make initial guesses, learn from their mistakes by processing more data, and continuously refine their understanding until they can perform tasks accurately.
45	4	Importance of Data Quantity and Accuracy	{"Effective machine training requires both a large volume of data and high accuracy in that data. The more diverse and precise the training data, the better the machine can generalize and correctly identify new, unseen examples."}	Effective machine training requires both a large volume of data and high accuracy in that data. The more diverse and precise the training data, the better the machine can generalize and correctly identify new, unseen examples.
46	4	Human Bias in Machine Learning	{"Human bias can unintentionally be embedded into the training data used for machine learning models. This occurs when the data reflects existing prejudices, preferences, or imbalances from the human creators or the real world it represents."}	Human bias can unintentionally be embedded into the training data used for machine learning models. This occurs when the data reflects existing prejudices, preferences, or imbalances from the human creators or the real world it represents.
47	4	Impact of Biased Training Data	{"If a machine is trained with biased data, its decisions and outcomes will reflect those biases, potentially leading to unfair or discriminatory results. For example, a system trained on one group's preferences might dissatisfy others."}	If a machine is trained with biased data, its decisions and outcomes will reflect those biases, potentially leading to unfair or discriminatory results. For example, a system trained on one group's preferences might dissatisfy others.
48	4	Ethical Implications of AI Bias	{"The presence of bias in AI systems carries significant ethical risks, especially in critical applications like education or justice. Biased AI can lead to unjust outcomes, denying opportunities or unfairly penalizing individuals based on flawed learned patterns."}	The presence of bias in AI systems carries significant ethical risks, especially in critical applications like education or justice. Biased AI can lead to unjust outcomes, denying opportunities or unfairly penalizing individuals based on flawed learned patterns.
49	5	Universal Relevance of Computer Science	{"Computer Science is a foundational skill that extends beyond traditional tech roles, empowering individuals in diverse professions like medicine, agriculture, and education to solve problems and innovate. It is relevant for virtually everyone in the modern world."}	Computer Science is a foundational skill that extends beyond traditional tech roles, empowering individuals in diverse professions like medicine, agriculture, and education to solve problems and innovate. It is relevant for virtually everyone in the modern world.
50	5	Diverse Professional Applications of Computer Science	{"Computer science enables advancements in various professional fields, such as engineers building self-driving cars, space scientists controlling rovers, animators creating movies, and fashion designers using computer-aided designs. These examples showcase the practical impact of CS across industries."}	Computer science enables advancements in various professional fields, such as engineers building self-driving cars, space scientists controlling rovers, animators creating movies, and fashion designers using computer-aided designs. These examples showcase the practical impact of CS across industries.
51	5	Importance of Role Models in STEM	{"Role models in Science, Technology, Engineering, and Mathematics (STEM) inspire individuals, especially younger learners, by demonstrating that success in these fields is achievable for people from all backgrounds. They help to normalize and encourage participation in STEM careers."}	Role models in Science, Technology, Engineering, and Mathematics (STEM) inspire individuals, especially younger learners, by demonstrating that success in these fields is achievable for people from all backgrounds. They help to normalize and encourage participation in STEM careers.
52	5	Challenging STEM Stereotypes	{"Many individuals are actively breaking down traditional stereotypes associated with STEM fields, showing that interests like poetry or art can coexist with scientific pursuits, and that gender, race, or age do not limit one's ability to learn Computer Science. This promotes inclusivity in tech."}	Many individuals are actively breaking down traditional stereotypes associated with STEM fields, showing that interests like poetry or art can coexist with scientific pursuits, and that gender, race, or age do not limit one's ability to learn Computer Science. This promotes inclusivity in tech.
53	5	Pioneering Figures in Computer Science History	{"Key historical figures like Ada Lovelace, recognized as the first computer programmer, and Charles Babbage, who conceived the first mechanical computer, laid the foundational theoretical and practical groundwork for modern computing. Their contributions are fundamental to the field's development."}	Key historical figures like Ada Lovelace, recognized as the first computer programmer, and Charles Babbage, who conceived the first mechanical computer, laid the foundational theoretical and practical groundwork for modern computing. Their contributions are fundamental to the field's development.
54	5	Contributions of Women in Computing	{"Women have played crucial roles in the history of computing, from Ada Lovelace's early algorithms to Grace Hopper's innovative work in programming languages and military computing. Recognizing these contributions highlights the diverse origins and development of computer science."}	Women have played crucial roles in the history of computing, from Ada Lovelace's early algorithms to Grace Hopper's innovative work in programming languages and military computing. Recognizing these contributions highlights the diverse origins and development of computer science.
55	5	Understanding Algorithmic Bias	{"Algorithmic bias occurs when computer programs, especially those using artificial intelligence, reflect and amplify human biases present in their training data, leading to unfair or inaccurate outcomes. Researchers like Joy Buolamwini work to identify and mitigate these ethical issues in AI."}	Algorithmic bias occurs when computer programs, especially those using artificial intelligence, reflect and amplify human biases present in their training data, leading to unfair or inaccurate outcomes. Researchers like Joy Buolamwini work to identify and mitigate these ethical issues in AI.
56	5	Computer Science in Space Exploration	{"Computer science is integral to space missions, enabling everything from the remote control and programming of Mars rovers to data analysis and mission planning. Pioneers like Kalpana Chawla and engineers like Vandana Verma exemplify its critical role in advancing our understanding of the universe."}	Computer science is integral to space missions, enabling everything from the remote control and programming of Mars rovers to data analysis and mission planning. Pioneers like Kalpana Chawla and engineers like Vandana Verma exemplify its critical role in advancing our understanding of the universe.
57	5	Computer Science for Entrepreneurship and Innovation	{"Entrepreneurs such as Elon Musk and Mark Zuckerberg have leveraged computer science to create groundbreaking companies and technologies, demonstrating how coding and computational thinking are essential skills for innovation and business leadership. They show the path from ideas to global impact."}	Entrepreneurs such as Elon Musk and Mark Zuckerberg have leveraged computer science to create groundbreaking companies and technologies, demonstrating how coding and computational thinking are essential skills for innovation and business leadership. They show the path from ideas to global impact.
58	5	The Input-Process-Output (IPO) Model	{"The IPO model describes the fundamental operation of all computer systems: data is received (Input), manipulated according to instructions (Process), and then a result is generated (Output). This model is a core concept for understanding how computers solve problems."}	The IPO model describes the fundamental operation of all computer systems: data is received (Input), manipulated according to instructions (Process), and then a result is generated (Output). This model is a core concept for understanding how computers solve problems.
59	5	Introduction to Machine Learning	{"Machine learning is a field of artificial intelligence where computers learn patterns from data without explicit programming, allowing them to make predictions or decisions. It can be applied in scenarios where machines perform tasks more efficiently or accurately than humans, such as complex data analysis."}	Machine learning is a field of artificial intelligence where computers learn patterns from data without explicit programming, allowing them to make predictions or decisions. It can be applied in scenarios where machines perform tasks more efficiently or accurately than humans, such as complex data analysis.
60	5	Computer Science for Social Impact	{"Computer science is a powerful tool for addressing global challenges and achieving social good, from Gitanjali Rao's inventions solving environmental problems to non-profits like 'Girls Who Code' founded by Reshma Saujani, aiming to increase diversity in tech education. It highlights the positive societal contributions of CS."}	Computer science is a powerful tool for addressing global challenges and achieving social good, from Gitanjali Rao's inventions solving environmental problems to non-profits like 'Girls Who Code' founded by Reshma Saujani, aiming to increase diversity in tech education. It highlights the positive societal contributions of CS.
61	5	Defining STEM Fields	{"STEM stands for Science, Technology, Engineering, and Mathematics, representing a crucial interdisciplinary approach to education and problem-solving. These fields are interconnected and foundational for innovation in the modern world."}	STEM stands for Science, Technology, Engineering, and Mathematics, representing a crucial interdisciplinary approach to education and problem-solving. These fields are interconnected and foundational for innovation in the modern world.
130	11	Design Thinking Approach	{"Explains a structured, five-step methodology for problem-solving: Empathize, Sketch Q&A, Story Frames, Create, and Review & Recreate. It provides a roadmap for tackling problems effectively and creatively."}	Explains a structured, five-step methodology for problem-solving: Empathize, Sketch Q&A, Story Frames, Create, and Review & Recreate. It provides a roadmap for tackling problems effectively and creatively.
62	5	Creative Applications of Computer Science	{"Computer science is not limited to technical fields but also powers creative industries. Animators use software to create movies and characters, while fashion designers employ computer-aided design (CAD) to develop new textiles and apparel, blending art with technology."}	Computer science is not limited to technical fields but also powers creative industries. Animators use software to create movies and characters, while fashion designers employ computer-aided design (CAD) to develop new textiles and apparel, blending art with technology.
63	5	Computer Science Education and Literacy	{"The importance of teaching computer science to children and students is highlighted by initiatives like Ashni Dwarkadas's Hackberry and Reshma Saujani's Girls Who Code. This ensures future generations are equipped with essential coding and computational thinking skills for a technology-driven world."}	The importance of teaching computer science to children and students is highlighted by initiatives like Ashni Dwarkadas's Hackberry and Reshma Saujani's Girls Who Code. This ensures future generations are equipped with essential coding and computational thinking skills for a technology-driven world.
64	6	The Internet	{"The Internet is a global network that connects various devices like computers, mobile phones, TVs, and even cars, enabling them to communicate with each other. It allows users to send and receive information, make calls, and share content across long distances instantly."}	The Internet is a global network that connects various devices like computers, mobile phones, TVs, and even cars, enabling them to communicate with each other. It allows users to send and receive information, make calls, and share content across long distances instantly.
65	6	Packets of Information	{"When data is sent over the internet, it is broken down into smaller pieces called packets of information. These packets are like small digital envelopes containing parts of your message, which are then reassembled at the destination."}	When data is sent over the internet, it is broken down into smaller pieces called packets of information. These packets are like small digital envelopes containing parts of your message, which are then reassembled at the destination.
66	6	Cables (Networking)	{"Cables are the physical medium that carry packets of information across the internet. They act like roads or pathways for data to travel between connected devices and networks."}	Cables are the physical medium that carry packets of information across the internet. They act like roads or pathways for data to travel between connected devices and networks.
67	6	Routers	{"Routers are network devices responsible for directing packets of data to their correct destination computers. They act like 'traffic police' for the internet, ensuring that information reaches the intended recipient efficiently."}	Routers are network devices responsible for directing packets of data to their correct destination computers. They act like 'traffic police' for the internet, ensuring that information reaches the intended recipient efficiently.
68	6	Transmission Control Protocol/Internet Protocol (TCP/IP)	{"TCP/IP refers to a set of rules and standards that govern how data is transmitted over the internet. These protocols ensure that all devices, routers, and cables follow the same procedures for sending and receiving information, allowing seamless communication."}	TCP/IP refers to a set of rules and standards that govern how data is transmitted over the internet. These protocols ensure that all devices, routers, and cables follow the same procedures for sending and receiving information, allowing seamless communication.
69	6	Wireless (Wi-Fi) Connection	{"A wireless connection, commonly known as Wi-Fi, allows devices to communicate with the internet using radio waves instead of physical cables. It typically provides internet access over short distances, such as within a home or office."}	A wireless connection, commonly known as Wi-Fi, allows devices to communicate with the internet using radio waves instead of physical cables. It typically provides internet access over short distances, such as within a home or office.
70	6	Mobile Data/Cellular Connection	{"Mobile data or cellular connection enables internet access through radio waves broadcasted from cellphone towers. Unlike Wi-Fi, it offers internet connectivity over much larger geographical areas, often covering an entire nation, and is typically provided by mobile network providers."}	Mobile data or cellular connection enables internet access through radio waves broadcasted from cellphone towers. Unlike Wi-Fi, it offers internet connectivity over much larger geographical areas, often covering an entire nation, and is typically provided by mobile network providers.
71	6	Web Browser	{"A web browser is a software application used to access and view information on the World Wide Web. It allows users to request and display web pages, send emails, watch videos, and interact with various online services."}	A web browser is a software application used to access and view information on the World Wide Web. It allows users to request and display web pages, send emails, watch videos, and interact with various online services.
72	6	Search Engine	{"A search engine is a program that allows users to find information on the internet by entering keywords or phrases. It quickly processes requests and provides relevant results, acting as a powerful tool for discovering web content."}	A search engine is a program that allows users to find information on the internet by entering keywords or phrases. It quickly processes requests and provides relevant results, acting as a powerful tool for discovering web content.
73	6	Client-Server Model	{"The client-server model describes how devices communicate over a network, where one device (the client) makes requests and another device (the server) responds to those requests. This model is fundamental to how the internet operates, from browsing websites to sending emails."}	The client-server model describes how devices communicate over a network, where one device (the client) makes requests and another device (the server) responds to those requests. This model is fundamental to how the internet operates, from browsing websites to sending emails.
74	6	Client (Networking)	{"In the client-server model, a client is typically a user's device, such as a computer, phone, or tablet, that initiates a request for information or services from the internet. It 'asks' for data from other devices."}	In the client-server model, a client is typically a user's device, such as a computer, phone, or tablet, that initiates a request for information or services from the internet. It 'asks' for data from other devices.
189	15	Looks Blocks	{"Looks blocks control a sprite's appearance and visual communication. The 'say' block, for instance, makes a sprite display a speech bubble with text for a set amount of time."}	Looks blocks control a sprite's appearance and visual communication. The 'say' block, for instance, makes a sprite display a speech bubble with text for a set amount of time.
76	6	Types of Servers	{"There are dedicated servers for handling specific tasks on the internet, such as web servers for hosting websites, mail servers for managing email communications, and file servers for storing and sharing files. Each type specializes in serving particular kinds of data or services."}	There are dedicated servers for handling specific tasks on the internet, such as web servers for hosting websites, mail servers for managing email communications, and file servers for storing and sharing files. Each type specializes in serving particular kinds of data or services.
77	6	Digital Divide	{"The digital divide refers to the unequal access to computers and the internet among different groups of people, often based on geographical location (rural vs. urban), socio-economic status, or gender. This disparity highlights the challenges some individuals face in engaging with modern technology and its benefits."}	The digital divide refers to the unequal access to computers and the internet among different groups of people, often based on geographical location (rural vs. urban), socio-economic status, or gender. This disparity highlights the challenges some individuals face in engaging with modern technology and its benefits.
78	7	Understanding Cyberbullying	{"Defines cyberbullying as the act of intentionally harming or harassing someone online through various digital platforms. It explains that this can manifest as mean comments, spreading rumors, or making threats, causing distress to the victim."}	Defines cyberbullying as the act of intentionally harming or harassing someone online through various digital platforms. It explains that this can manifest as mean comments, spreading rumors, or making threats, causing distress to the victim.
79	7	Identifying Online Hate Speech	{"Focuses on recognizing hateful or derogatory comments made online that are intended to insult, demean, or spread negativity. It teaches how to differentiate between constructive criticism and harmful hate speech."}	Focuses on recognizing hateful or derogatory comments made online that are intended to insult, demean, or spread negativity. It teaches how to differentiate between constructive criticism and harmful hate speech.
80	7	Emotional Impact of Cyberbullying	{"Explains how being a target of cyberbullying can lead to negative emotions such as sadness, isolation, and anxiety. It highlights the importance of acknowledging these feelings and seeking appropriate support."}	Explains how being a target of cyberbullying can lead to negative emotions such as sadness, isolation, and anxiety. It highlights the importance of acknowledging these feelings and seeking appropriate support.
81	7	Role of a Digital Citizen	{"Describes the responsibilities of being a good digital citizen, emphasizing kind, considerate, and ethical behavior online. It involves knowing one's online limits and using the internet in a righteous and positive manner."}	Describes the responsibilities of being a good digital citizen, emphasizing kind, considerate, and ethical behavior online. It involves knowing one's online limits and using the internet in a righteous and positive manner.
82	7	Reporting Online Misconduct	{"Outlines the necessary steps and importance of reporting instances of cyberbullying or hate speech to relevant authorities, such as school administration, parents, or platform moderators. It stresses that reporting helps protect victims and address harmful behavior."}	Outlines the necessary steps and importance of reporting instances of cyberbullying or hate speech to relevant authorities, such as school administration, parents, or platform moderators. It stresses that reporting helps protect victims and address harmful behavior.
83	7	Digital Footprint and Future Implications	{"Defines a digital footprint as the unique data trail left by an individual's online activities. It explains how this permanent record can influence future opportunities, such as college admissions or job prospects, underscoring the need for careful online conduct."}	Defines a digital footprint as the unique data trail left by an individual's online activities. It explains how this permanent record can influence future opportunities, such as college admissions or job prospects, underscoring the need for careful online conduct.
84	7	Consequences of Online Hate Speech	{"Discusses the serious repercussions for individuals who engage in hate speech or cyberbullying online. This includes potential disciplinary actions from institutions, damage to personal reputation, and the understanding that online actions can be traced."}	Discusses the serious repercussions for individuals who engage in hate speech or cyberbullying online. This includes potential disciplinary actions from institutions, damage to personal reputation, and the understanding that online actions can be traced.
85	7	Traceability of Deleted Online Content	{"Explains that even if online comments or posts are deleted by the user, they often remain traceable by authorities or digital forensics experts. This emphasizes the lasting nature of digital information and accountability for online actions."}	Explains that even if online comments or posts are deleted by the user, they often remain traceable by authorities or digital forensics experts. This emphasizes the lasting nature of digital information and accountability for online actions.
86	7	Promoting Online Empathy	{"Encourages users to practice empathy and kindness when interacting online, considering the feelings of others before posting comments or sharing content. It promotes a supportive and respectful online environment for everyone."}	Encourages users to practice empathy and kindness when interacting online, considering the feelings of others before posting comments or sharing content. It promotes a supportive and respectful online environment for everyone.
87	7	Responsible Social Media Engagement	{"Covers guidelines for interacting appropriately on social media platforms, including thoughtful posting of personal content, engaging in constructive discussions, and respecting diverse viewpoints. It emphasizes positive online participation and safety."}	Covers guidelines for interacting appropriately on social media platforms, including thoughtful posting of personal content, engaging in constructive discussions, and respecting diverse viewpoints. It emphasizes positive online participation and safety.
88	7	Seeking Support for Cyberbullying	{"Teaches the importance of not suffering in silence when experiencing cyberbullying and encourages reaching out to trusted adults, such as parents, teachers, or counselors, for help and guidance. It highlights that seeking help is a sign of strength."}	Teaches the importance of not suffering in silence when experiencing cyberbullying and encourages reaching out to trusted adults, such as parents, teachers, or counselors, for help and guidance. It highlights that seeking help is a sign of strength.
90	7	Identifying Online Trolls	{"Explains what an 'online troll' is – someone who intentionally posts inflammatory, extraneous, or offensive messages on the internet, often to provoke readers and disrupt online discussions. This helps users identify and address sources of negativity."}	Explains what an 'online troll' is – someone who intentionally posts inflammatory, extraneous, or offensive messages on the internet, often to provoke readers and disrupt online discussions. This helps users identify and address sources of negativity.
91	8	Digital Wellbeing	{"Digital wellbeing refers to the overall impact of technology use on an individual's mental, physical, and social health. It encourages users to maintain a healthy balance with their digital devices and online activities."}	Digital wellbeing refers to the overall impact of technology use on an individual's mental, physical, and social health. It encourages users to maintain a healthy balance with their digital devices and online activities.
92	8	Screen Time Management	{"Screen time management involves setting limits and creating strategies for how long and when individuals use digital devices. This practice helps prevent excessive use, promotes productivity, and encourages engagement in offline activities."}	Screen time management involves setting limits and creating strategies for how long and when individuals use digital devices. This practice helps prevent excessive use, promotes productivity, and encourages engagement in offline activities.
93	8	Technology Addiction/Compulsive Use	{"Technology addiction or compulsive use describes a behavioral pattern where individuals feel controlled by technology, using it excessively to the detriment of other aspects of their lives, such as health, relationships, or academic performance."}	Technology addiction or compulsive use describes a behavioral pattern where individuals feel controlled by technology, using it excessively to the detriment of other aspects of their lives, such as health, relationships, or academic performance.
94	8	Digital Breaks	{"Digital breaks are intentional periods of time away from screens and digital devices. These breaks often involve physical activities like stretching, breathing exercises, or outdoor walks, aimed at reducing eye strain and improving focus and overall wellbeing."}	Digital breaks are intentional periods of time away from screens and digital devices. These breaks often involve physical activities like stretching, breathing exercises, or outdoor walks, aimed at reducing eye strain and improving focus and overall wellbeing.
95	8	Responsible Digital Citizenship	{"Responsible digital citizenship involves understanding and practicing safe, ethical, and legal behaviors when interacting with technology and the internet. It includes respecting others, protecting personal information, and being mindful of one's digital footprint."}	Responsible digital citizenship involves understanding and practicing safe, ethical, and legal behaviors when interacting with technology and the internet. It includes respecting others, protecting personal information, and being mindful of one's digital footprint.
96	8	Cybercrime Awareness	{"Cybercrime awareness is the understanding of various criminal activities conducted using computers and the internet. This includes recognizing common threats like online scams, data theft, and other malicious acts."}	Cybercrime awareness is the understanding of various criminal activities conducted using computers and the internet. This includes recognizing common threats like online scams, data theft, and other malicious acts.
97	8	Phishing/Spam Identification	{"Phishing and spam identification involves recognizing fraudulent attempts, typically via email, to trick users into revealing sensitive information or clicking malicious links. Learning to identify suspicious messages is crucial for online security."}	Phishing and spam identification involves recognizing fraudulent attempts, typically via email, to trick users into revealing sensitive information or clicking malicious links. Learning to identify suspicious messages is crucial for online security.
98	8	Cyberstalking	{"Cyberstalking refers to the use of the internet or other electronic means to harass, intimidate, or threaten an individual. It often involves repeated, unwanted contact or monitoring that causes fear or distress."}	Cyberstalking refers to the use of the internet or other electronic means to harass, intimidate, or threaten an individual. It often involves repeated, unwanted contact or monitoring that causes fear or distress.
99	8	Sexting and Legal Implications	{"Sexting is the act of sending or receiving sexually explicit messages or images via digital devices. It carries significant legal implications, especially for minors, as it can be considered a legal offense and sexual harassment."}	Sexting is the act of sending or receiving sexually explicit messages or images via digital devices. It carries significant legal implications, especially for minors, as it can be considered a legal offense and sexual harassment.
100	8	Multi-factor Authentication (MFA)	{"Multi-factor Authentication (MFA) is a security system that requires more than one method of verification to grant access to an account or system. It typically combines something the user knows (password) with something they have (phone/token) or something they are (fingerprint)."}	Multi-factor Authentication (MFA) is a security system that requires more than one method of verification to grant access to an account or system. It typically combines something the user knows (password) with something they have (phone/token) or something they are (fingerprint).
101	8	Age-Appropriate Media Consumption	{"Age-appropriate media consumption involves selecting and engaging with digital content, such as TV shows, games, and online videos, that is suitable for one's developmental stage and maturity level. This promotes healthy exposure to information and entertainment."}	Age-appropriate media consumption involves selecting and engaging with digital content, such as TV shows, games, and online videos, that is suitable for one's developmental stage and maturity level. This promotes healthy exposure to information and entertainment.
102	8	Online Harassment and Inappropriate Requests	{"Online harassment involves persistent and unwanted digital interactions that can cause distress or harm, while inappropriate requests refer to solicitations for personal information or content that is uncomfortable or sexual in nature. Recognizing and reporting such interactions is vital for online safety."}	Online harassment involves persistent and unwanted digital interactions that can cause distress or harm, while inappropriate requests refer to solicitations for personal information or content that is uncomfortable or sexual in nature. Recognizing and reporting such interactions is vital for online safety.
103	8	Spreading Digital Literacy and Awareness	{"Spreading digital literacy and awareness means sharing knowledge and best practices about responsible technology use, online safety, and digital wellbeing with peers, family, and the wider community. It empowers others to become informed and safe digital citizens."}	Spreading digital literacy and awareness means sharing knowledge and best practices about responsible technology use, online safety, and digital wellbeing with peers, family, and the wider community. It empowers others to become informed and safe digital citizens.
104	9	Internet Cookie Definition and Purpose	{"An internet cookie is a small piece of data containing a unique user ID, obtained from a specific website and stored on a user's computer. Its primary purpose is to help websites track and identify individual users, remembering their preferences and interactions."}	An internet cookie is a small piece of data containing a unique user ID, obtained from a specific website and stored on a user's computer. Its primary purpose is to help websites track and identify individual users, remembering their preferences and interactions.
105	9	How Cookies Track Online Activity	{"Cookies enable websites to track user behavior, such as items viewed, shopping cart contents, or pages visited. This information is then used to personalize user experience, often by displaying related advertisements on other platforms."}	Cookies enable websites to track user behavior, such as items viewed, shopping cart contents, or pages visited. This information is then used to personalize user experience, often by displaying related advertisements on other platforms.
106	9	Third-Party Cookies and Cross-Site Tracking	{"Third-party cookies are cookies set by a website other than the one currently being visited, often through embedded content like social media 'like' or 'share' buttons. These cookies can enable tracking of a user's activity across multiple unrelated websites, raising privacy concerns."}	Third-party cookies are cookies set by a website other than the one currently being visited, often through embedded content like social media 'like' or 'share' buttons. These cookies can enable tracking of a user's activity across multiple unrelated websites, raising privacy concerns.
107	9	Managing Online Privacy through Browser Settings	{"Users can enhance their online privacy by configuring browser security settings to block third-party cookies. This action prevents websites from collecting and sharing personal data for cross-site tracking purposes."}	Users can enhance their online privacy by configuring browser security settings to block third-party cookies. This action prevents websites from collecting and sharing personal data for cross-site tracking purposes.
108	9	Browser Extensions for Privacy Protection	{"Browser extensions like Privacy Badger and Ghostery are tools designed to help users block illegitimate trackers and unwanted data collection online. These extensions add an extra layer of protection beyond standard browser settings."}	Browser extensions like Privacy Badger and Ghostery are tools designed to help users block illegitimate trackers and unwanted data collection online. These extensions add an extra layer of protection beyond standard browser settings.
109	9	Legitimate and Beneficial Uses of Cookies	{"Not all cookies are used for intrusive tracking; many serve useful functions to improve user experience. For example, cookies can remember login details for frequently visited websites, saving users time and effort from re-entering credentials."}	Not all cookies are used for intrusive tracking; many serve useful functions to improve user experience. For example, cookies can remember login details for frequently visited websites, saving users time and effort from re-entering credentials.
110	9	Definition and Sources of Big Data	{"Big data refers to extremely large datasets that may be analyzed computationally to reveal patterns, trends, and associations. It is collected from various online activities, including Google searches, social media posts, online shopping history, and location tracking."}	Big data refers to extremely large datasets that may be analyzed computationally to reveal patterns, trends, and associations. It is collected from various online activities, including Google searches, social media posts, online shopping history, and location tracking.
111	9	Predictive Analytics and AI with Big Data	{"Artificial intelligence (AI) and machine learning algorithms can be trained on vast amounts of big data to identify patterns and make predictions about user behavior, preferences, or future actions. This capability allows systems to anticipate needs or suggest relevant content."}	Artificial intelligence (AI) and machine learning algorithms can be trained on vast amounts of big data to identify patterns and make predictions about user behavior, preferences, or future actions. This capability allows systems to anticipate needs or suggest relevant content.
112	9	Big Data and Personal Privacy Concerns	{"The extensive collection, analysis, and monetization of big data raise significant questions about personal privacy. As more data is gathered and used to create detailed user profiles, individuals' privacy may feel compromised or 'obsolete'."}	The extensive collection, analysis, and monetization of big data raise significant questions about personal privacy. As more data is gathered and used to create detailed user profiles, individuals' privacy may feel compromised or 'obsolete'.
113	9	Ethical and Beneficial Applications of Artificial Intelligence	{"Beyond data tracking, AI has numerous ethical applications that serve humanity, such as assisting in education, helping disabled individuals, and providing support for mental health. These applications demonstrate AI's potential for positive societal impact."}	Beyond data tracking, AI has numerous ethical applications that serve humanity, such as assisting in education, helping disabled individuals, and providing support for mental health. These applications demonstrate AI's potential for positive societal impact.
114	9	Identifying Phishing and Scam Messages	{"Phishing and scam messages often use manipulative language, trigger words creating urgency or fear, or offer unbelievable discounts to trick recipients. Learning to spot these characteristics is crucial for digital safety and protecting personal information."}	Phishing and scam messages often use manipulative language, trigger words creating urgency or fear, or offer unbelievable discounts to trick recipients. Learning to spot these characteristics is crucial for digital safety and protecting personal information.
131	11	Empathy in Problem Solving	{"Highlights the crucial first step of understanding a problem from the perspective of those experiencing it. This involves listening, observing body language, facial expressions, and emotions to gain insight into their feelings and needs."}	Highlights the crucial first step of understanding a problem from the perspective of those experiencing it. This involves listening, observing body language, facial expressions, and emotions to gain insight into their feelings and needs.
115	9	Distinction Between Cookies and Cache	{"While both are stored by browsers, cookies save user-specific data for tracking and personalization, such as login states. Cache, on the other hand, stores website files like images and scripts to speed up future loading times of that site. Clearing each has different impacts on your browsing experience."}	While both are stored by browsers, cookies save user-specific data for tracking and personalization, such as login states. Cache, on the other hand, stores website files like images and scripts to speed up future loading times of that site. Clearing each has different impacts on your browsing experience.
116	10	Problem Identification (Food Waste)	{"Recognizing food waste as a significant problem, initially perceived on a personal level (loss of energy) but later understood to have broader implications. This involves identifying the core issue that needs to be addressed."}	Recognizing food waste as a significant problem, initially perceived on a personal level (loss of energy) but later understood to have broader implications. This involves identifying the core issue that needs to be addressed.
117	10	Societal Impact Analysis (Malnutrition)	{"Understanding how individual actions, such as wasting food, contribute to widespread societal issues like malnutrition and starvation, affecting a large population globally and locally (e.g., 33 lakh children in India)."}	Understanding how individual actions, such as wasting food, contribute to widespread societal issues like malnutrition and starvation, affecting a large population globally and locally (e.g., 33 lakh children in India).
118	10	Data Interpretation for Social Issues	{"Learning to interpret quantitative data, such as statistics on malnourished children, to grasp the scale and urgency of a social problem. This concept emphasizes using factual information to understand a situation."}	Learning to interpret quantitative data, such as statistics on malnourished children, to grasp the scale and urgency of a social problem. This concept emphasizes using factual information to understand a situation.
119	10	Influence of Global Events on Social Problems	{"Analyzing how major global events, like the COVID-19 pandemic, can exacerbate existing societal challenges such as food insecurity and malnutrition, worsening conditions for vulnerable populations."}	Analyzing how major global events, like the COVID-19 pandemic, can exacerbate existing societal challenges such as food insecurity and malnutrition, worsening conditions for vulnerable populations.
120	10	Resource Management and Energy Footprint	{"Understanding that food production requires significant energy for growing, processing, and shipping. Wasting food therefore also wastes these embedded energy resources, highlighting inefficient resource allocation."}	Understanding that food production requires significant energy for growing, processing, and shipping. Wasting food therefore also wastes these embedded energy resources, highlighting inefficient resource allocation.
121	10	Causal Relationship (Food Waste to Climate Change)	{"Identifying the indirect but significant causal link where the energy wasted in food production and distribution contributes to climate change. This demonstrates a chain of cause-and-effect that can be modeled."}	Identifying the indirect but significant causal link where the energy wasted in food production and distribution contributes to climate change. This demonstrates a chain of cause-and-effect that can be modeled.
122	10	Environmental Impact of Consumption Choices	{"Recognizing that conscious daily choices, such as preferring seasonal fruits and vegetables, can lead to reduced environmental impact by minimizing the energy and resources required for out-of-season produce."}	Recognizing that conscious daily choices, such as preferring seasonal fruits and vegetables, can lead to reduced environmental impact by minimizing the energy and resources required for out-of-season produce.
123	10	Risks and Consequences of Climate Change	{"Learning about the severe and tangible risks posed by climate change, including an increased frequency of extreme weather events like storms, flooding, and landslides, affecting human safety and stability."}	Learning about the severe and tangible risks posed by climate change, including an increased frequency of extreme weather events like storms, flooding, and landslides, affecting human safety and stability.
124	10	System Thinking (Interconnectedness of Actions)	{"Grasping that individual actions, like wasting food, are not isolated but are part of a complex system, impacting personal well-being, society, and the environment in interconnected ways. This encourages a holistic view of problems."}	Grasping that individual actions, like wasting food, are not isolated but are part of a complex system, impacting personal well-being, society, and the environment in interconnected ways. This encourages a holistic view of problems.
125	10	Ethical Decision-Making & Personal Responsibility	{"Developing an awareness of the broader ethical implications of one's actions, leading to a desire to act responsibly and contribute positively to societal and environmental well-being, exemplified by Yahya's shift in perspective."}	Developing an awareness of the broader ethical implications of one's actions, leading to a desire to act responsibly and contribute positively to societal and environmental well-being, exemplified by Yahya's shift in perspective.
126	10	Information Processing & Perspective Shift	{"Observing how receiving new information and understanding its context can lead to a significant change in perspective, moving from ignorance or indifference to anxiety and a desire to take action, similar to an 'alert' state."}	Observing how receiving new information and understanding its context can lead to a significant change in perspective, moving from ignorance or indifference to anxiety and a desire to take action, similar to an 'alert' state.
127	10	Problem Decomposition for Understanding Impact	{"The mother's explanation implicitly decomposes the overarching problem of 'food waste' into distinct sub-problems: personal health, societal hunger, and environmental degradation, making the complex issue more understandable."}	The mother's explanation implicitly decomposes the overarching problem of 'food waste' into distinct sub-problems: personal health, societal hunger, and environmental degradation, making the complex issue more understandable.
128	10	Developing Empathy and Prosocial Behavior	{"The lesson fosters empathy by highlighting the suffering of others due to food scarcity, motivating a desire to help and engage in prosocial behaviors to address the needs of the community and the world."}	The lesson fosters empathy by highlighting the suffering of others due to food scarcity, motivating a desire to help and engage in prosocial behaviors to address the needs of the community and the world.
132	11	Information Gathering & Research	{"Teaches how to collect relevant data and facts about a problem after empathizing. This includes leveraging statistics, personal observations, notes, and digital search tools like Google to deepen understanding."}	Teaches how to collect relevant data and facts about a problem after empathizing. This includes leveraging statistics, personal observations, notes, and digital search tools like Google to deepen understanding.
133	11	Defining the Problem (Sketch Q&A)	{"Focuses on formulating key questions and sketching answers about the problem, such as 'Why is it important?', 'What impact would solving it have?', and 'When/how was it created?'. This step helps to clearly articulate the problem's scope and significance."}	Focuses on formulating key questions and sketching answers about the problem, such as 'Why is it important?', 'What impact would solving it have?', and 'When/how was it created?'. This step helps to clearly articulate the problem's scope and significance.
134	11	Brainstorming Solutions (Story Frames)	{"Encourages generating multiple, diverse potential solutions or 'story frames' to address the defined problem. This phase emphasizes creative thinking and exploring various angles before committing to a single approach."}	Encourages generating multiple, diverse potential solutions or 'story frames' to address the defined problem. This phase emphasizes creative thinking and exploring various angles before committing to a single approach.
135	11	Prototyping and Model Creation	{"Explains the process of selecting one story frame and creating an initial 'model' or prototype of the chosen solution. This hands-on step allows for a tangible representation of the idea, whether physical or digital."}	Explains the process of selecting one story frame and creating an initial 'model' or prototype of the chosen solution. This hands-on step allows for a tangible representation of the idea, whether physical or digital.
136	11	Digital Tools for Prototyping	{"Introduces the use of digital applications, such as Google Slides, to create models or presentations of solutions. This demonstrates how technology can be used to build and visualize prototypes effectively."}	Introduces the use of digital applications, such as Google Slides, to create models or presentations of solutions. This demonstrates how technology can be used to build and visualize prototypes effectively.
137	11	Iterative Design (Review & Recreate)	{"Emphasizes the importance of reviewing the created model, gathering feedback from the community, and making necessary changes. This iterative process allows for continuous improvement and refinement of the solution."}	Emphasizes the importance of reviewing the created model, gathering feedback from the community, and making necessary changes. This iterative process allows for continuous improvement and refinement of the solution.
138	11	User-Centered Feedback Integration	{"Highlights the critical role of obtaining reviews and feedback from the people who will be most affected by the solution. This ensures that the final solution truly meets their needs and is practical for them."}	Highlights the critical role of obtaining reviews and feedback from the people who will be most affected by the solution. This ensures that the final solution truly meets their needs and is practical for them.
139	11	Considering Constraints and Caveats	{"Explains the need to consider specific conditions or limitations, such as medical caveats, when designing and implementing solutions. This ensures the solution is safe, appropriate, and effective for all users."}	Explains the need to consider specific conditions or limitations, such as medical caveats, when designing and implementing solutions. This ensures the solution is safe, appropriate, and effective for all users.
140	11	Collaborative Problem Solving	{"Illustrates how working with others, such as friends and community members, can lead to more comprehensive solutions. The example of Rani working with her sister and friends demonstrates the benefits of teamwork."}	Illustrates how working with others, such as friends and community members, can lead to more comprehensive solutions. The example of Rani working with her sister and friends demonstrates the benefits of teamwork.
141	12	Problem Definition and Identification	{"This involves clearly recognizing and articulating a specific problem, such as malnutrition or overflowing waste, as the foundational step before attempting to design a solution. A well-defined problem guides the entire problem-solving process."}	This involves clearly recognizing and articulating a specific problem, such as malnutrition or overflowing waste, as the foundational step before attempting to design a solution. A well-defined problem guides the entire problem-solving process.
142	12	Data Collection Methods	{"The process of gathering relevant information from various sources to understand a problem comprehensively. Examples include conducting interviews with community members, family, and experts, or researching academic papers and existing documentation."}	The process of gathering relevant information from various sources to understand a problem comprehensively. Examples include conducting interviews with community members, family, and experts, or researching academic papers and existing documentation.
143	12	Design Thinking Methodology	{"A human-centered approach to problem-solving that emphasizes understanding user needs (empathize), defining the problem, generating ideas (ideate), building prototypes, and testing solutions. Yahya's creation of a digital library exemplifies this iterative process."}	A human-centered approach to problem-solving that emphasizes understanding user needs (empathize), defining the problem, generating ideas (ideate), building prototypes, and testing solutions. Yahya's creation of a digital library exemplifies this iterative process.
144	12	Model Creation and Prototyping	{"The act of building a simplified representation or an initial version of a solution to test concepts, gather feedback, and identify potential issues early on. This can range from a digital library model to a physical paper boat or a redesigned dustbin."}	The act of building a simplified representation or an initial version of a solution to test concepts, gather feedback, and identify potential issues early on. This can range from a digital library model to a physical paper boat or a redesigned dustbin.
145	12	Iterative Design Process	{"This describes the cyclical process of refining a solution by repeatedly reviewing an existing model or prototype, identifying weaknesses or 'caveats', and making successive improvements to create a better version. It emphasizes continuous learning and improvement."}	This describes the cyclical process of refining a solution by repeatedly reviewing an existing model or prototype, identifying weaknesses or 'caveats', and making successive improvements to create a better version. It emphasizes continuous learning and improvement.
146	12	Sequential Instructions (Algorithms)	{"A set of ordered steps or commands that must be followed in a precise sequence to achieve a specific outcome. The origami instructions for folding a paper boat provide a clear visual example of an algorithm in action."}	A set of ordered steps or commands that must be followed in a precise sequence to achieve a specific outcome. The origami instructions for folding a paper boat provide a clear visual example of an algorithm in action.
147	12	Geometric Composition	{"The skill of combining basic geometric shapes like triangles, rectangles, and pentagons to construct more complex figures or objects. This demonstrates spatial reasoning and the ability to build new structures from fundamental components."}	The skill of combining basic geometric shapes like triangles, rectangles, and pentagons to construct more complex figures or objects. This demonstrates spatial reasoning and the ability to build new structures from fundamental components.
148	12	Comparative Analysis in Design	{"The process of evaluating and contrasting different design options or prototypes based on specific criteria to determine the most effective solution. An example is comparing cylindrical and rectangular dustbin designs to reduce spills."}	The process of evaluating and contrasting different design options or prototypes based on specific criteria to determine the most effective solution. An example is comparing cylindrical and rectangular dustbin designs to reduce spills.
149	12	Importance of Referencing Data Sources	{"Acknowledging and citing the sources from which information, data, or images are obtained. This practice ensures academic integrity, validates the information presented, and allows others to verify or further explore the facts."}	Acknowledging and citing the sources from which information, data, or images are obtained. This practice ensures academic integrity, validates the information presented, and allows others to verify or further explore the facts.
150	12	Empathy in Problem Solving	{"Understanding and considering the perspectives, needs, and feelings of the individuals or communities affected by a problem. This human-centered approach is crucial for designing solutions that are truly relevant and impactful for users."}	Understanding and considering the perspectives, needs, and feelings of the individuals or communities affected by a problem. This human-centered approach is crucial for designing solutions that are truly relevant and impactful for users.
151	12	Ideation and Story Framing	{"The creative process of generating diverse ideas and imagining different 'story frames' or scenarios to explore various potential solutions for a defined problem. This involves brainstorming, sketching questions, and envisioning outcomes."}	The creative process of generating diverse ideas and imagining different 'story frames' or scenarios to explore various potential solutions for a defined problem. This involves brainstorming, sketching questions, and envisioning outcomes.
152	12	Application of Problem-Solving Skills	{"Utilizing logical thinking and structured approaches to address a wide range of real-world challenges. This includes diverse scenarios from engineering a non-sinking boat to designing an efficient waste management system."}	Utilizing logical thinking and structured approaches to address a wide range of real-world challenges. This includes diverse scenarios from engineering a non-sinking boat to designing an efficient waste management system.
153	13	Modeling Problems with Software	{"This concept explains how software tools, like Google Slides, can be used to create visual or functional models of real-world problems. It emphasizes that building a model helps in understanding and planning a solution before implementing it."}	This concept explains how software tools, like Google Slides, can be used to create visual or functional models of real-world problems. It emphasizes that building a model helps in understanding and planning a solution before implementing it.
154	13	Human-Computer Collaboration	{"This highlights the efficiency and effectiveness achieved when humans and computers work together to solve problems. It suggests that combining human thinking with computer processing power leads to better outcomes."}	This highlights the efficiency and effectiveness achieved when humans and computers work together to solve problems. It suggests that combining human thinking with computer processing power leads to better outcomes.
155	13	Introduction to Computational Thinking	{"Computational thinking is introduced as a way for humans to approach problems in a manner that makes them solvable by computers. It's presented as a crucial skill for effectively utilizing computers."}	Computational thinking is introduced as a way for humans to approach problems in a manner that makes them solvable by computers. It's presented as a crucial skill for effectively utilizing computers.
156	13	Algorithms as Step-by-Step Instructions	{"An algorithm is defined as a precise set of step-by-step instructions that must be followed in a specific order to achieve a desired outcome. The process of making roti serves as a concrete, relatable example of an algorithm."}	An algorithm is defined as a precise set of step-by-step instructions that must be followed in a specific order to achieve a desired outcome. The process of making roti serves as a concrete, relatable example of an algorithm.
157	13	Sequencing in Algorithms	{"Sequencing refers to arranging instructions in a precise and specific order within an algorithm. It is crucial to ensure that the algorithm produces the correct and expected results, as demonstrated by the potential failure of making rotis if steps are out of order."}	Sequencing refers to arranging instructions in a precise and specific order within an algorithm. It is crucial to ensure that the algorithm produces the correct and expected results, as demonstrated by the potential failure of making rotis if steps are out of order.
158	13	Abstraction	{"Abstraction is the process of simplifying a problem by ignoring unnecessary details and focusing only on the most relevant information. This helps in creating clearer and more effective algorithms, as seen when writing a roti-making algorithm that omits trivial details."}	Abstraction is the process of simplifying a problem by ignoring unnecessary details and focusing only on the most relevant information. This helps in creating clearer and more effective algorithms, as seen when writing a roti-making algorithm that omits trivial details.
159	13	Decomposition	{"Decomposition involves breaking down a complex problem or process into smaller, more manageable steps. This strategy makes the problem easier to understand and solve, especially when developing algorithms for computers."}	Decomposition involves breaking down a complex problem or process into smaller, more manageable steps. This strategy makes the problem easier to understand and solve, especially when developing algorithms for computers.
160	13	Precision in Algorithms for Computers	{"When writing algorithms for computers, it is essential that the instructions are precise and accurate. Any ambiguity or inaccuracy can lead to incorrect results, emphasizing the strict nature of computer instructions."}	When writing algorithms for computers, it is essential that the instructions are precise and accurate. Any ambiguity or inaccuracy can lead to incorrect results, emphasizing the strict nature of computer instructions.
161	13	Translating Algorithms to Code	{"This concept explains that algorithms, once designed, are translated into code that a computer can understand and execute. This forms the fundamental link between computational thinking and programming."}	This concept explains that algorithms, once designed, are translated into code that a computer can understand and execute. This forms the fundamental link between computational thinking and programming.
162	13	Microprocessors and CPUs	{"A microprocessor is introduced as a 'computer on a single chip,' with the CPU (Central Processing Unit) being responsible for processing information and controlling operations. The Rotimatic machine provides a real-world example of this hardware component."}	A microprocessor is introduced as a 'computer on a single chip,' with the CPU (Central Processing Unit) being responsible for processing information and controlling operations. The Rotimatic machine provides a real-world example of this hardware component.
163	13	Role of Sensors in Robotics	{"Sensors are presented as devices that gather information from the environment, such as temperature, position, and consistency. In the Rotimatic, smart sensors enable the machine to adapt and make decisions during the roti-making process."}	Sensors are presented as devices that gather information from the environment, such as temperature, position, and consistency. In the Rotimatic, smart sensors enable the machine to adapt and make decisions during the roti-making process.
164	13	Role of Motors in Robotics	{"Motors are described as components that provide movement and control in automated systems. In the Rotimatic machine, motors are crucial for performing actions like kneading dough and rolling rotis."}	Motors are described as components that provide movement and control in automated systems. In the Rotimatic machine, motors are crucial for performing actions like kneading dough and rolling rotis.
165	13	Automation and Robotics Applications	{"This concept illustrates how algorithms and hardware are combined to create automated machines like the Rotimatic. It shows how robotics can solve real-world problems by performing complex tasks efficiently and automatically."}	This concept illustrates how algorithms and hardware are combined to create automated machines like the Rotimatic. It shows how robotics can solve real-world problems by performing complex tasks efficiently and automatically.
166	13	Introduction to Machine Learning	{"Machine learning is briefly introduced as a capability where machines can learn from data to improve their performance over time. The Rotimatic's ability to learn about doughballs to make better rotis is used as an accessible example."}	Machine learning is briefly introduced as a capability where machines can learn from data to improve their performance over time. The Rotimatic's ability to learn about doughballs to make better rotis is used as an accessible example.
167	14	Algorithm	{"An algorithm is a set of clear, step-by-step instructions designed to solve a specific problem or complete a task. The video uses the example of drawing a square to illustrate how algorithms break down complex actions into simple, executable steps."}	An algorithm is a set of clear, step-by-step instructions designed to solve a specific problem or complete a task. The video uses the example of drawing a square to illustrate how algorithms break down complex actions into simple, executable steps.
168	14	Sequencing	{"Sequencing refers to the specific order in which instructions or steps in an algorithm are performed. For an algorithm to achieve its intended outcome, each step must be executed in the correct, predetermined sequence."}	Sequencing refers to the specific order in which instructions or steps in an algorithm are performed. For an algorithm to achieve its intended outcome, each step must be executed in the correct, predetermined sequence.
169	14	Abstraction	{"Abstraction is a computational thinking skill that involves simplifying a complex problem by focusing on essential details and ignoring unnecessary information. This process helps in managing complexity and creating more generalized and understandable solutions."}	Abstraction is a computational thinking skill that involves simplifying a complex problem by focusing on essential details and ignoring unnecessary information. This process helps in managing complexity and creating more generalized and understandable solutions.
170	14	Computational Thinking	{"Computational Thinking is a problem-solving approach that utilizes concepts fundamental to computer science. It encompasses skills like decomposition, pattern recognition, abstraction, and algorithm design to tackle complex problems efficiently."}	Computational Thinking is a problem-solving approach that utilizes concepts fundamental to computer science. It encompasses skills like decomposition, pattern recognition, abstraction, and algorithm design to tackle complex problems efficiently.
171	14	Digital Application (App)	{"A digital application, or 'app,' is a software program designed to run on electronic devices like smartphones or computers to perform specific functions. The example in the video is an app created to identify and provide information about wild edibles."}	A digital application, or 'app,' is a software program designed to run on electronic devices like smartphones or computers to perform specific functions. The example in the video is an app created to identify and provide information about wild edibles.
172	14	Pattern Recognition	{"Pattern recognition is a computational thinking skill that involves identifying similarities, trends, or recurring characteristics within data, problems, or systems. Recognizing these patterns helps in understanding underlying structures and developing efficient solutions."}	Pattern recognition is a computational thinking skill that involves identifying similarities, trends, or recurring characteristics within data, problems, or systems. Recognizing these patterns helps in understanding underlying structures and developing efficient solutions.
173	14	Decomposition	{"Decomposition is a computational thinking technique where a complex problem is broken down into smaller, more manageable sub-problems or tasks. This makes the overall problem easier to understand, analyze, and solve step-by-step."}	Decomposition is a computational thinking technique where a complex problem is broken down into smaller, more manageable sub-problems or tasks. This makes the overall problem easier to understand, analyze, and solve step-by-step.
174	14	Coding/Programming	{"Coding, or programming, is the process of writing instructions for a computer using a specific programming language. These instructions translate an algorithm into a format that a computer can understand and execute to perform a desired task."}	Coding, or programming, is the process of writing instructions for a computer using a specific programming language. These instructions translate an algorithm into a format that a computer can understand and execute to perform a desired task.
175	14	Scratch Programming Environment	{"Scratch is a visual, block-based programming language and online community developed for beginners, particularly children, to learn coding concepts. Yahya utilized Scratch to build the digital wild edibles app demonstrated in the lesson."}	Scratch is a visual, block-based programming language and online community developed for beginners, particularly children, to learn coding concepts. Yahya utilized Scratch to build the digital wild edibles app demonstrated in the lesson.
176	14	App Design Algorithm	{"An App Design Algorithm outlines the structured steps required to plan and develop a digital application. This includes defining user interface elements like screens and buttons, as well as navigation and core functionalities."}	An App Design Algorithm outlines the structured steps required to plan and develop a digital application. This includes defining user interface elements like screens and buttons, as well as navigation and core functionalities.
177	14	Generalization	{"Generalization is the process of developing a solution that is flexible enough to be adapted and applied to a broader range of similar problems or situations. Yahya's wild edibles app design is generalized so others can reuse it for their localities."}	Generalization is the process of developing a solution that is flexible enough to be adapted and applied to a broader range of similar problems or situations. Yahya's wild edibles app design is generalized so others can reuse it for their localities.
178	14	Design Thinking	{"Design Thinking is an iterative, human-centered approach to problem-solving that focuses on understanding user needs, challenging assumptions, and creating innovative solutions. It is presented as a complementary methodology to computational thinking for developing effective solutions."}	Design Thinking is an iterative, human-centered approach to problem-solving that focuses on understanding user needs, challenging assumptions, and creating innovative solutions. It is presented as a complementary methodology to computational thinking for developing effective solutions.
179	15	Scratch Sprites	{"Sprites are interactive characters or objects used in Scratch programs. Each sprite can have unique code to dictate its behavior, allowing for multiple characters to act independently or interactively within a single project."}	Sprites are interactive characters or objects used in Scratch programs. Each sprite can have unique code to dictate its behavior, allowing for multiple characters to act independently or interactively within a single project.
180	15	Scratch Backdrop	{"A backdrop serves as the background or stage setting for a Scratch project. It provides the visual environment against which sprites perform their actions and interact."}	A backdrop serves as the background or stage setting for a Scratch project. It provides the visual environment against which sprites perform their actions and interact.
181	15	Sprite Positioning (X, Y Coordinates)	{"Sprites are positioned on the Scratch stage using a coordinate system. The X-coordinate determines the horizontal position, and the Y-coordinate determines the vertical position of a sprite."}	Sprites are positioned on the Scratch stage using a coordinate system. The X-coordinate determines the horizontal position, and the Y-coordinate determines the vertical position of a sprite.
182	15	Scratch Stage Coordinate System	{"The center of the Scratch stage is represented by the coordinates (X:0, Y:0). Positive X values move a sprite to the right, negative X to the left; positive Y values move up, and negative Y move down."}	The center of the Scratch stage is represented by the coordinates (X:0, Y:0). Positive X values move a sprite to the right, negative X to the left; positive Y values move up, and negative Y move down.
183	15	Events in Programming	{"Events are triggers that initiate actions or sequences of code in a program. In Scratch, common events include clicking the green flag to start, clicking on a sprite, or receiving a specific message."}	Events are triggers that initiate actions or sequences of code in a program. In Scratch, common events include clicking the green flag to start, clicking on a sprite, or receiving a specific message.
184	15	Actions in Programming	{"Actions are the specific behaviors or tasks that a sprite or program performs in response to an event. Examples include making a sprite 'say' something, 'glide' to a new location, or 'broadcast' a message."}	Actions are the specific behaviors or tasks that a sprite or program performs in response to an event. Examples include making a sprite 'say' something, 'glide' to a new location, or 'broadcast' a message.
185	15	Event-Driven Programming	{"This is a programming paradigm where the flow of the program is determined by events and their corresponding actions. Users interact with the program (events), and the program responds accordingly (actions)."}	This is a programming paradigm where the flow of the program is determined by events and their corresponding actions. Users interact with the program (events), and the program responds accordingly (actions).
186	15	Inter-sprite Communication (Broadcast & Receive)	{"Sprites can communicate with each other using 'broadcast' and 'receive' blocks. One sprite can 'broadcast' a message, and another sprite can be programmed to perform an action 'when I receive' that specific message."}	Sprites can communicate with each other using 'broadcast' and 'receive' blocks. One sprite can 'broadcast' a message, and another sprite can be programmed to perform an action 'when I receive' that specific message.
187	15	Code Sequencing	{"The order of blocks in a script dictates the order in which actions are executed. If blocks are arranged incorrectly, the program's behavior will not be as intended, highlighting the importance of correct sequencing."}	The order of blocks in a script dictates the order in which actions are executed. If blocks are arranged incorrectly, the program's behavior will not be as intended, highlighting the importance of correct sequencing.
188	15	Motion Blocks	{"Motion blocks control a sprite's movement and position on the stage. Examples include 'go to x y' to instantly set a sprite's location and 'glide to x y' for smooth movement over a specified duration."}	Motion blocks control a sprite's movement and position on the stage. Examples include 'go to x y' to instantly set a sprite's location and 'glide to x y' for smooth movement over a specified duration.
190	15	Text-to-Speech Feature	{"Scratch allows sprites to 'speak' text out loud using 'set voice to' and 'speak' blocks. This feature converts written text into audible speech, often requiring an active internet connection for processing."}	Scratch allows sprites to 'speak' text out loud using 'set voice to' and 'speak' blocks. This feature converts written text into audible speech, often requiring an active internet connection for processing.
191	15	Scratch Library Assets	{"The Scratch platform provides a rich library of pre-designed sprites and backdrops. Users can select and incorporate these existing assets into their projects, simplifying the creation process."}	The Scratch platform provides a rich library of pre-designed sprites and backdrops. Users can select and incorporate these existing assets into their projects, simplifying the creation process.
192	15	Adjusting Sprite Properties	{"Users can modify various properties of a sprite, such as its size, directly within the Scratch interface. This allows for customization and proper scaling of characters on the stage."}	Users can modify various properties of a sprite, such as its size, directly within the Scratch interface. This allows for customization and proper scaling of characters on the stage.
193	16	Algorithms in Nature	{"An algorithm is a sequence of well-defined steps used to solve a problem or complete a task. Natural processes, like the metamorphosis of a butterfly, can be understood as algorithms because they follow distinct, ordered stages from beginning to end."}	An algorithm is a sequence of well-defined steps used to solve a problem or complete a task. Natural processes, like the metamorphosis of a butterfly, can be understood as algorithms because they follow distinct, ordered stages from beginning to end.
194	16	Computational Thinking: Decomposition	{"Decomposition is a computational thinking skill that involves breaking down a large, complex problem or project into smaller, more manageable sub-problems or tasks. This makes the overall problem easier to understand, design, and implement, as demonstrated by breaking the metamorphosis project into individual sprite behaviors."}	Decomposition is a computational thinking skill that involves breaking down a large, complex problem or project into smaller, more manageable sub-problems or tasks. This makes the overall problem easier to understand, design, and implement, as demonstrated by breaking the metamorphosis project into individual sprite behaviors.
195	16	Scratch Sprites and Stage	{"In Scratch, sprites are the interactive objects that perform actions and animations on the screen, while the stage is the background area where all the sprites interact. Projects begin by selecting or creating sprites and placing them in their initial positions on the stage."}	In Scratch, sprites are the interactive objects that perform actions and animations on the screen, while the stage is the background area where all the sprites interact. Projects begin by selecting or creating sprites and placing them in their initial positions on the stage.
196	16	Scratch Costumes	{"Costumes are different visual appearances for a single sprite in Scratch. Sprites can have multiple costumes, and these can be changed dynamically during a project to create animation, represent different states (like an egg changing to a caterpillar), or show variations of an object."}	Costumes are different visual appearances for a single sprite in Scratch. Sprites can have multiple costumes, and these can be changed dynamically during a project to create animation, represent different states (like an egg changing to a caterpillar), or show variations of an object.
197	16	Creating Custom Sprites	{"When a desired sprite is not available in the Scratch library, users can create their own custom sprites using the built-in paint editor. This allows for personalized characters and objects, adding unique elements to projects, as shown by drawing the caterpillar and cocoon."}	When a desired sprite is not available in the Scratch library, users can create their own custom sprites using the built-in paint editor. This allows for personalized characters and objects, adding unique elements to projects, as shown by drawing the caterpillar and cocoon.
198	16	Event: 'When Green Flag Clicked'	{"The 'When Green Flag Clicked' block is a fundamental event block in Scratch that initiates scripts when the green flag icon is clicked, starting the project. It tells the associated sprite or stage to begin executing its code, setting the initial state of the project."}	The 'When Green Flag Clicked' block is a fundamental event block in Scratch that initiates scripts when the green flag icon is clicked, starting the project. It tells the associated sprite or stage to begin executing its code, setting the initial state of the project.
199	16	Event: 'When This Sprite Clicked'	{"The 'When This Sprite Clicked' block is an event that triggers a script when the user clicks on a specific sprite on the stage. This block allows for user interaction, making sprites responsive to input and driving changes in the project, such as an egg hatching when interacted with."}	The 'When This Sprite Clicked' block is an event that triggers a script when the user clicks on a specific sprite on the stage. This block allows for user interaction, making sprites responsive to input and driving changes in the project, such as an egg hatching when interacted with.
200	16	Sprite Communication (Broadcast/Receive Messages)	{"Broadcasting and receiving messages enable different sprites to communicate and coordinate actions with each other. One sprite can 'broadcast' a message, and any other sprite listening for that message can 'receive' it to trigger its own specific scripts, facilitating complex, synchronized interactions like stages of metamorphosis."}	Broadcasting and receiving messages enable different sprites to communicate and coordinate actions with each other. One sprite can 'broadcast' a message, and any other sprite listening for that message can 'receive' it to trigger its own specific scripts, facilitating complex, synchronized interactions like stages of metamorphosis.
201	16	Controlling Sprite Visibility (Show/Hide)	{"The 'show' and 'hide' blocks control whether a sprite is visible on the stage at any given moment. These blocks are essential for managing the appearance and disappearance of sprites throughout a project, ensuring only relevant sprites are visible during specific stages."}	The 'show' and 'hide' blocks control whether a sprite is visible on the stage at any given moment. These blocks are essential for managing the appearance and disappearance of sprites throughout a project, ensuring only relevant sprites are visible during specific stages.
202	16	Sprite Positioning (Go to X Y)	{"The 'go to x: _ y: _' block allows for precise positioning of a sprite on the Scratch stage using X and Y coordinates. This is crucial for setting a sprite's initial location or instantly moving it to a specific point on the screen."}	The 'go to x: _ y: _' block allows for precise positioning of a sprite on the Scratch stage using X and Y coordinates. This is crucial for setting a sprite's initial location or instantly moving it to a specific point on the screen.
203	16	Sprite Movement and Animation (Glide)	{"The 'glide _ secs to x: _ y: _' block makes a sprite move smoothly from its current position to a specified X and Y coordinate over a set duration. This block is key for creating animated movements, providing a fluid transition rather than an instantaneous jump."}	The 'glide _ secs to x: _ y: _' block makes a sprite move smoothly from its current position to a specified X and Y coordinate over a set duration. This block is key for creating animated movements, providing a fluid transition rather than an instantaneous jump.
204	16	Adjusting Sprite Size	{"The 'set size to _%' and 'change size by _' blocks allow control over a sprite's visual size. These blocks are used to make sprites appear smaller or larger, adding dynamic visual effects and animations, such as a caterpillar growing or a butterfly appearing larger."}	The 'set size to _%' and 'change size by _' blocks allow control over a sprite's visual size. These blocks are used to make sprites appear smaller or larger, adding dynamic visual effects and animations, such as a caterpillar growing or a butterfly appearing larger.
205	17	Infinite loops (`forever` block)	{"Using the 'forever' block to create a sequence of actions that repeats endlessly. In the example, a sprite moves continuously across the screen."}	Using the 'forever' block to create a sequence of actions that repeats endlessly. In the example, a sprite moves continuously across the screen.
206	17	Finite loops (`repeat` block)	{"Using the 'repeat' block to execute a set of commands a specific number of times, as opposed to a 'forever' loop which runs infinitely."}	Using the 'repeat' block to execute a set of commands a specific number of times, as opposed to a 'forever' loop which runs infinitely.
207	17	Event handling (`when green flag clicked`)	{"Using the 'when green flag clicked' block to start a script when the project is initiated."}	Using the 'when green flag clicked' block to start a script when the project is initiated.
208	17	Boundary checking (`if on edge, bounce`)	{"Using the 'if on edge, bounce' block within a loop to make a sprite reverse direction upon reaching the edge of the stage."}	Using the 'if on edge, bounce' block within a loop to make a sprite reverse direction upon reaching the edge of the stage.
209	17	Sprite motion (`move steps` block)	{"Using the 'move steps' block to change a sprite's position along its current direction."}	Using the 'move steps' block to change a sprite's position along its current direction.
210	17	Sprite orientation (`set rotation style`)	{"Using the 'set rotation style' block to control how a sprite visually orients itself, specifically to prevent it from turning upside down after bouncing off an edge."}	Using the 'set rotation style' block to control how a sprite visually orients itself, specifically to prevent it from turning upside down after bouncing off an edge.
211	17	Variable creation and initialization	{"Creating a new variable (e.g., 'emotion') and giving it an initial value using the 'set variable to' block."}	Creating a new variable (e.g., 'emotion') and giving it an initial value using the 'set variable to' block.
212	17	Changing variable values	{"Updating the value of a variable during the program to track a changing state, such as a sprite's emotion."}	Updating the value of a variable during the program to track a changing state, such as a sprite's emotion.
213	17	Sprite communication (`broadcast` and `receive`)	{"Using 'broadcast' and 'when I receive' blocks to enable communication and trigger scripts between different sprites."}	Using 'broadcast' and 'when I receive' blocks to enable communication and trigger scripts between different sprites.
214	17	User interaction (`when this sprite clicked`)	{"Using the 'when this sprite clicked' event block to trigger a script when the user clicks on a specific sprite."}	Using the 'when this sprite clicked' event block to trigger a script when the user clicks on a specific sprite.
215	17	String manipulation (`join` operator)	{"Using the 'join' operator to combine strings of text with the value of a variable to create dynamic messages."}	Using the 'join' operator to combine strings of text with the value of a variable to create dynamic messages.
216	17	Managing sprite visibility (`show` and `hide`)	{"Using the 'show' and 'hide' blocks to control which sprite is visible on the stage at different points in the program."}	Using the 'show' and 'hide' blocks to control which sprite is visible on the stage at different points in the program.
217	17	Dynamic broadcasting	{"Broadcasting a message that is dynamically created by joining text with a variable, allowing for more flexible inter-sprite communication."}	Broadcasting a message that is dynamically created by joining text with a variable, allowing for more flexible inter-sprite communication.
218	17	Using speech and thought bubbles (`say`/`think`)	{"Making sprites display messages on the screen for a set duration using the 'say for seconds' or 'think for seconds' blocks."}	Making sprites display messages on the screen for a set duration using the 'say for seconds' or 'think for seconds' blocks.
219	17	Decomposition	{"The computational thinking concept of breaking down a complex problem into smaller, more manageable parts, demonstrated by coding the behavior for each emotional state of the sprite separately."}	The computational thinking concept of breaking down a complex problem into smaller, more manageable parts, demonstrated by coding the behavior for each emotional state of the sprite separately.
220	18	Using Variables to Store State	{"A variable named 'emotion' is used to store and track the character's current emotional state (e.g., 'sad', 'angry', 'balance'). This allows the program to know which emotion is active."}	A variable named 'emotion' is used to store and track the character's current emotional state (e.g., 'sad', 'angry', 'balance'). This allows the program to know which emotion is active.
221	18	Initializing Program State	{"Using the 'when green flag clicked' event to set the initial conditions of the program, such as setting the starting backdrop, hiding most sprites, showing the first sprite, and setting the initial value of the 'emotion' variable."}	Using the 'when green flag clicked' event to set the initial conditions of the program, such as setting the starting backdrop, hiding most sprites, showing the first sprite, and setting the initial value of the 'emotion' variable.
222	18	Updating Variable Values	{"Using the 'set variable to' block to change the value of the 'emotion' variable as the story progresses from one emotional state to the next."}	Using the 'set variable to' block to change the value of the 'emotion' variable as the story progresses from one emotional state to the next.
223	18	Event Handling with 'when this sprite clicked'	{"Triggering a sequence of actions, such as speaking and broadcasting a message, when the user clicks on a specific sprite."}	Triggering a sequence of actions, such as speaking and broadcasting a message, when the user clicks on a specific sprite.
224	18	Communication between Sprites using Broadcast/Receive	{"Using 'broadcast' and 'when I receive' blocks to enable sprites to communicate and trigger actions in one another, creating a cause-and-effect sequence."}	Using 'broadcast' and 'when I receive' blocks to enable sprites to communicate and trigger actions in one another, creating a cause-and-effect sequence.
225	18	String Concatenation with 'join' operator	{"Using the 'join' block to combine a text string (e.g., 'I am ') with the value of the 'emotion' variable to create dynamic messages in 'say' or 'broadcast' blocks."}	Using the 'join' block to combine a text string (e.g., 'I am ') with the value of the 'emotion' variable to create dynamic messages in 'say' or 'broadcast' blocks.
226	18	Synchronizing Scripts with 'broadcast and wait'	{"Using the 'broadcast and wait' block to ensure that the receiving scripts complete their actions before the broadcasting script continues, which helps control the flow of the animation."}	Using the 'broadcast and wait' block to ensure that the receiving scripts complete their actions before the broadcasting script continues, which helps control the flow of the animation.
227	18	Controlling Sprite Visibility	{"Using the 'show' and 'hide' blocks to make different sprites appear and disappear, so that only the sprite representing the current emotion is visible on the stage."}	Using the 'show' and 'hide' blocks to make different sprites appear and disappear, so that only the sprite representing the current emotion is visible on the stage.
228	18	Using 'say' and 'think' Blocks for Narration	{"Displaying speech or thought bubbles for a specified duration to convey a character's dialogue or internal thoughts as part of the story."}	Displaying speech or thought bubbles for a specified duration to convey a character's dialogue or internal thoughts as part of the story.
229	18	Scene Management with Backdrops	{"Using the 'switch backdrop to' block to change the stage's background image to reflect a change in location or mood in the story."}	Using the 'switch backdrop to' block to change the stage's background image to reflect a change in location or mood in the story.
230	18	Using a 'repeat' Loop for Animation	{"Employing the 'repeat' block to execute a set of motion blocks multiple times, creating a continuous movement effect for the 'Angry' sprite."}	Employing the 'repeat' block to execute a set of motion blocks multiple times, creating a continuous movement effect for the 'Angry' sprite.
231	18	Conditional Motion with 'if on edge, bounce'	{"Using the 'if on edge, bounce' block inside a loop to make a sprite change direction automatically when it reaches the boundary of the stage."}	Using the 'if on edge, bounce' block inside a loop to make a sprite change direction automatically when it reaches the boundary of the stage.
232	18	Sprite Positioning with Coordinates	{"Using the 'go to x: y:' block to set a sprite's precise starting position on the stage when it appears."}	Using the 'go to x: y:' block to set a sprite's precise starting position on the stage when it appears.
233	18	Controlling Script Timing with 'wait' block	{"Using the 'wait' block to introduce pauses into a script, controlling the timing and pacing of the animation and dialogue."}	Using the 'wait' block to introduce pauses into a script, controlling the timing and pacing of the animation and dialogue.
234	18	Playing Sounds on Event	{"Using the 'start sound' block to play a sound effect when a specific event occurs, such as when the 'Angry' sprite appears."}	Using the 'start sound' block to play a sound effect when a specific event occurs, such as when the 'Angry' sprite appears.
235	19	User Input with `ask and wait`	{"Using the `ask [question] and wait` block from the Sensing category to prompt the user for text input and pause the script until an answer is provided."}	Using the `ask [question] and wait` block from the Sensing category to prompt the user for text input and pause the script until an answer is provided.
236	19	Using the `answer` variable	{"Accessing the user's most recent input by using the built-in `answer` variable from the Sensing category. This variable is used in conditional checks."}	Accessing the user's most recent input by using the built-in `answer` variable from the Sensing category. This variable is used in conditional checks.
237	19	Conditional Logic: `if-then` block	{"Using an `if-then` block to execute a set of commands only if a specific condition, such as comparing the user's `answer` to a word, is true."}	Using an `if-then` block to execute a set of commands only if a specific condition, such as comparing the user's `answer` to a word, is true.
238	19	Conditional Logic: `if-then-else` ladder	{"Structuring multiple conditions using a chain of `if-then-else` blocks. This allows the program to check for several mutually exclusive possibilities efficiently."}	Structuring multiple conditions using a chain of `if-then-else` blocks. This allows the program to check for several mutually exclusive possibilities efficiently.
239	19	String Comparison with `equals` operator	{"Using the `=` operator block to compare the `answer` variable to a specific text string (e.g., 'grateful' or 'bully') to create a true/false condition."}	Using the `=` operator block to compare the `answer` variable to a specific text string (e.g., 'grateful' or 'bully') to create a true/false condition.
240	19	Collision Detection with `touching`	{"Using the `touching [sprite]?` block as a condition within an `if-then` block to detect when one sprite makes contact with another, triggering an action like hiding."}	Using the `touching [sprite]?` block as a condition within an `if-then` block to detect when one sprite makes contact with another, triggering an action like hiding.
241	19	Event Handling: `when green flag clicked`	{"Using the `when green flag clicked` event block to initialize a sprite's state (e.g., position, size, visibility) at the start of the program."}	Using the `when green flag clicked` event block to initialize a sprite's state (e.g., position, size, visibility) at the start of the program.
242	19	Sprite Animation with `glide` to sprite	{"Using the `glide [secs] to [sprite]` block to create smooth animated movement for a sprite towards a target sprite, such as a cloud gliding to a bucket."}	Using the `glide [secs] to [sprite]` block to create smooth animated movement for a sprite towards a target sprite, such as a cloud gliding to a bucket.
243	19	Changing Sprite Appearance with `switch costume`	{"Using the `switch costume to [costume]` block to dynamically change a sprite's image based on a condition, like showing a positive or negative thought cloud."}	Using the `switch costume to [costume]` block to dynamically change a sprite's image based on a condition, like showing a positive or negative thought cloud.
244	19	Sprite Visibility Control with `show` and `hide`	{"Using the `show` and `hide` blocks to control when a sprite is visible on the stage, often for initialization or after an interaction."}	Using the `show` and `hide` blocks to control when a sprite is visible on the stage, often for initialization or after an interaction.
245	19	Dynamic Sizing with `change size by`	{"Using the `change size by []` block with a negative value to decrease a sprite's size, creating a visual effect as it moves."}	Using the `change size by []` block with a negative value to decrease a sprite's size, creating a visual effect as it moves.
246	19	Absolute Positioning with `go to x: y:`	{"Setting a sprite's initial position on the stage using specific X and Y coordinates with the `go to x: y:` block."}	Setting a sprite's initial position on the stage using specific X and Y coordinates with the `go to x: y:` block.
247	19	Boolean Logic in Conditions	{"Understanding that conditions within control blocks (like `if-then`) evaluate to a Boolean value (true or false), which dictates the program's execution flow."}	Understanding that conditions within control blocks (like `if-then`) evaluate to a Boolean value (true or false), which dictates the program's execution flow.
248	19	Outputting Variable Content with `say`	{"Using the `say` block to display the content of the `answer` variable in a speech bubble, providing feedback to the user."}	Using the `say` block to display the content of the `answer` variable in a speech bubble, providing feedback to the user.
249	19	Sprite Initialization	{"The process of setting up a sprite's initial state (position, size, costume, visibility) using a `when green flag clicked` script to ensure the program starts consistently."}	The process of setting up a sprite's initial state (position, size, costume, visibility) using a `when green flag clicked` script to ensure the program starts consistently.
250	20	Event Handling with 'when this sprite clicked'	{"Using the 'when this sprite clicked' hat block to trigger a script when a user interacts with a sprite by clicking on it."}	Using the 'when this sprite clicked' hat block to trigger a script when a user interacts with a sprite by clicking on it.
251	20	Using the 'if-then-else' block	{"Implementing conditional logic to execute one of two different sets of commands based on whether a condition is true or false. In the image, this block separates the logic for positive and negative thoughts."}	Implementing conditional logic to execute one of two different sets of commands based on whether a condition is true or false. In the image, this block separates the logic for positive and negative thoughts.
252	20	Using the 'or' boolean operator	{"Combining multiple conditions with the 'or' operator. The entire expression is true if at least one of the individual conditions is true. The script uses it to check for multiple positive or negative words."}	Combining multiple conditions with the 'or' operator. The entire expression is true if at least one of the individual conditions is true. The script uses it to check for multiple positive or negative words.
253	20	String comparison using the '=' operator	{"Using the '=' operator to check if a variable (like 'answer') contains a specific string of text (e.g., 'grateful')."}	Using the '=' operator to check if a variable (like 'answer') contains a specific string of text (e.g., 'grateful').
254	20	Using the 'answer' sensing block	{"The 'answer' block is a special variable that stores the user's most recent typed input from an 'ask and wait' block. The script uses it to evaluate the user's thought."}	The 'answer' block is a special variable that stores the user's most recent typed input from an 'ask and wait' block. The script uses it to evaluate the user's thought.
255	20	Nested conditional statements	{"Placing an 'if' block inside the 'else' section of an 'if-then-else' block to create a multi-level decision-making structure."}	Placing an 'if' block inside the 'else' section of an 'if-then-else' block to create a multi-level decision-making structure.
256	20	Changing sprite appearance with 'switch costume to'	{"Using the 'switch costume to' block to change a sprite's visual look. The script uses different costumes for positive ('cloud2_pos') and negative ('cloud2_neg') outcomes."}	Using the 'switch costume to' block to change a sprite's visual look. The script uses different costumes for positive ('cloud2_pos') and negative ('cloud2_neg') outcomes.
257	20	Modifying sprite size with 'change size by'	{"Using the 'change size by' block to increase or decrease the size of a sprite. In the script, the size is decreased by 50."}	Using the 'change size by' block to increase or decrease the size of a sprite. In the script, the size is decreased by 50.
258	20	Motion with the 'glide to' block	{"Using the 'glide...secs to...' block to move a sprite smoothly to the location of another sprite or a specific point over a set amount of time."}	Using the 'glide...secs to...' block to move a sprite smoothly to the location of another sprite or a specific point over a set amount of time.
259	20	Using the 'if-then' block	{"Implementing a simple conditional statement that executes a set of commands only if its condition is met. The script uses this at the end to check if the sprite is touching a color."}	Implementing a simple conditional statement that executes a set of commands only if its condition is met. The script uses this at the end to check if the sprite is touching a color.
260	20	Sensing color contact with 'touching color?'	{"Using the 'touching color?' boolean block as a condition to detect if a sprite is in contact with a specific color on the stage or another sprite."}	Using the 'touching color?' boolean block as a condition to detect if a sprite is in contact with a specific color on the stage or another sprite.
261	20	Making sprites disappear with the 'hide' block	{"Using the 'hide' block from the Looks category to make a sprite invisible on the stage."}	Using the 'hide' block from the Looks category to make a sprite invisible on the stage.
262	20	Boolean Logic Evaluation	{"Understanding that conditions in Scratch (like 'answer = grateful') evaluate to a true or false value, which the transcript relates to the binary concepts of 1 and 0."}	Understanding that conditions in Scratch (like 'answer = grateful') evaluate to a true or false value, which the transcript relates to the binary concepts of 1 and 0.
263	20	Code Efficiency with Logical Operators	{"Recognizing that using boolean operators like 'or' can simplify code and make it more efficient than writing multiple, separate 'if' statements to check for similar conditions."}	Recognizing that using boolean operators like 'or' can simplify code and make it more efficient than writing multiple, separate 'if' statements to check for similar conditions.
264	21	Creating Custom Blocks (My Blocks)	{"Defining a new block (procedure/function) using the 'define' hat block to encapsulate a sequence of commands, such as the notes for a song's stanza. This helps in organizing and reusing code."}	Defining a new block (procedure/function) using the 'define' hat block to encapsulate a sequence of commands, such as the notes for a song's stanza. This helps in organizing and reusing code.
265	21	Calling Custom Blocks	{"Using a custom-made block within a script to execute the sequence of commands defined for it. For example, calling the 'stanza1 music' block inside a main 'play music' script."}	Using a custom-made block within a script to execute the sequence of commands defined for it. For example, calling the 'stanza1 music' block inside a main 'play music' script.
266	21	Code Modularity with Functions	{"The practice of breaking down a large program into smaller, independent modules (custom blocks). In this project, the karaoke program is broken down into functions for each stanza's music and animation, making it easier to test and manage."}	The practice of breaking down a large program into smaller, independent modules (custom blocks). In this project, the karaoke program is broken down into functions for each stanza's music and animation, making it easier to test and manage.
267	21	Nested Loops	{"Using a 'repeat' block inside another 'repeat' block to create complex repetitive patterns. This is shown in the code for 'stanza2 music' where a musical phrase is repeated within a larger repeating section."}	Using a 'repeat' block inside another 'repeat' block to create complex repetitive patterns. This is shown in the code for 'stanza2 music' where a musical phrase is repeated within a larger repeating section.
268	21	Using the Music Extension	{"Adding and using blocks from the Music extension, such as 'play note' and 'rest', to create melodies and rhythms in a project."}	Adding and using blocks from the Music extension, such as 'play note' and 'rest', to create melodies and rhythms in a project.
269	21	play note for beats block	{"Using the 'play note' block to play a specific musical note (identified by a number) for a specified duration in beats to create a song."}	Using the 'play note' block to play a specific musical note (identified by a number) for a specified duration in beats to create a song.
270	21	rest for beats block	{"Using the 'rest' block to create a pause or silence in the music for a specified duration in beats, which is crucial for musical timing."}	Using the 'rest' block to create a pause or silence in the music for a specified duration in beats, which is crucial for musical timing.
271	21	Synchronization of Sound and Motion	{"Coordinating the timing of a sprite's movement (like the arrow) with the sounds or music being played using 'wait' blocks and the duration of 'play note' blocks."}	Coordinating the timing of a sprite's movement (like the arrow) with the sounds or music being played using 'wait' blocks and the duration of 'play note' blocks.
272	21	Using the Pen 'stamp' block	{"Using the 'stamp' block from the Pen extension to create a permanent image of the sprite on the stage at its current location, as seen with the blooming flowers visualization."}	Using the 'stamp' block from the Pen extension to create a permanent image of the sprite on the stage at its current location, as seen with the blooming flowers visualization.
273	21	Using the 'erase all' block	{"Using the 'erase all' block, typically at the start of a script, to clear any drawings or stamps from the stage from a previous run of the program."}	Using the 'erase all' block, typically at the start of a script, to clear any drawings or stamps from the stage from a previous run of the program.
274	21	Using Variables for Positioning	{"Creating and using variables (e.g., 'x' and 'y') to store and update coordinate values, which are then used with 'set x' and 'set y' blocks to control sprite positioning for stamping."}	Creating and using variables (e.g., 'x' and 'y') to store and update coordinate values, which are then used with 'set x' and 'set y' blocks to control sprite positioning for stamping.
275	21	Sequential Execution within Functions	{"Understanding that blocks inside a custom block (function) execute in order from top to bottom. For example, in the 'play music' function, 'stanza1 music' is called, then 'stanza2 music', then 'stanza3 music'."}	Understanding that blocks inside a custom block (function) execute in order from top to bottom. For example, in the 'play music' function, 'stanza1 music' is called, then 'stanza2 music', then 'stanza3 music'.
276	21	Decomposition	{"Breaking down a complex problem (creating a full karaoke animation) into smaller, more manageable sub-problems (code for stanza 1 music, code for stanza 2 animation, etc.). This is demonstrated by creating a separate function for each part."}	Breaking down a complex problem (creating a full karaoke animation) into smaller, more manageable sub-problems (code for stanza 1 music, code for stanza 2 animation, etc.). This is demonstrated by creating a separate function for each part.
277	21	Abstraction	{"Hiding complex details behind a simple interface. The 'play music' custom block is an example of abstraction, as it runs all the complex note sequences for every stanza with a single block call."}	Hiding complex details behind a simple interface. The 'play music' custom block is an example of abstraction, as it runs all the complex note sequences for every stanza with a single block call.
278	21	Event Handling (when green flag clicked)	{"Using the 'when green flag clicked' event handler block to trigger a script and start the main program, such as playing the karaoke song."}	Using the 'when green flag clicked' event handler block to trigger a script and start the main program, such as playing the karaoke song.
279	22	Video Sensing Extension	{"Using the Scratch Video Sensing extension to incorporate live camera input into a project. This involves adding the extension and using its specific blocks."}	Using the Scratch Video Sensing extension to incorporate live camera input into a project. This involves adding the extension and using its specific blocks.
280	22	Event Handling (`when green flag clicked`)	{"Using the 'when green flag clicked' event block to initialize the program, such as turning on the video feed and setting its properties."}	Using the 'when green flag clicked' event block to initialize the program, such as turning on the video feed and setting its properties.
281	22	Infinite Loops (`forever` block)	{"Using a 'forever' block to create a script that runs continuously throughout the program, allowing for constant checking of conditions like video motion."}	Using a 'forever' block to create a script that runs continuously throughout the program, allowing for constant checking of conditions like video motion.
282	22	Conditional Wait (`wait until` block)	{"Using the 'wait until' control block to pause a script's execution until a specific boolean condition is met, such as waiting for detected motion to exceed a threshold."}	Using the 'wait until' control block to pause a script's execution until a specific boolean condition is met, such as waiting for detected motion to exceed a threshold.
283	22	Sensing Video Motion	{"Using the 'video motion on sprite' block to get a numerical value representing the amount of motion detected by the camera over the sprite's area."}	Using the 'video motion on sprite' block to get a numerical value representing the amount of motion detected by the camera over the sprite's area.
284	22	Comparison Operators (`>` block)	{"Using the greater than '>' operator to compare the sensed video motion value to a fixed number (e.g., 50), creating a true/false condition."}	Using the greater than '>' operator to compare the sensed video motion value to a fixed number (e.g., 50), creating a true/false condition.
285	22	Managing Sprite Costumes	{"Creating and organizing multiple costumes for a single sprite, where each costume represents a different visual state or filter (e.g., a hat, glasses, a moustache)."}	Creating and organizing multiple costumes for a single sprite, where each costume represents a different visual state or filter (e.g., a hat, glasses, a moustache).
286	22	Changing Costumes (`next costume`)	{"Using the 'next costume' block from the Looks palette to programmatically cycle through a sprite's list of costumes in sequence."}	Using the 'next costume' block from the Looks palette to programmatically cycle through a sprite's list of costumes in sequence.
287	22	Timing and Delays (`wait` block)	{"Using the 'wait' block to pause the script for a specified duration, controlling the pace at which costumes (filters) change."}	Using the 'wait' block to pause the script for a specified duration, controlling the pace at which costumes (filters) change.
288	22	Using the Paint Editor	{"Utilizing the built-in Scratch Paint Editor to draw and design custom graphics to be used as sprite costumes for the face filters."}	Utilizing the built-in Scratch Paint Editor to draw and design custom graphics to be used as sprite costumes for the face filters.
289	22	Controlling Video Properties	{"Using the 'set video transparency to' block to adjust the visibility of the camera feed on the stage."}	Using the 'set video transparency to' block to adjust the visibility of the camera feed on the stage.
290	22	Event Handling (`when this sprite clicked`)	{"Using the 'when this sprite clicked' event as a way to allow user interaction, such as manually changing to the next costume with a mouse click."}	Using the 'when this sprite clicked' event as a way to allow user interaction, such as manually changing to the next costume with a mouse click.
291	22	Sequencing within a Loop	{"Arranging blocks in a specific order inside a loop to create a desired behavior, such as waiting for motion, then changing a costume, then waiting for a period of time."}	Arranging blocks in a specific order inside a loop to create a desired behavior, such as waiting for motion, then changing a costume, then waiting for a period of time.
292	22	Sensor-based Interaction	{"Creating a program that reacts to physical input from a sensor (the camera detecting motion) rather than just keyboard or mouse input."}	Creating a program that reacts to physical input from a sensor (the camera detecting motion) rather than just keyboard or mouse input.
293	23	Using Variables for State Management	{"Using a variable, like 'count', to keep track of the number of user interactions (taps) and determine the program's next action, such as which shape to draw."}	Using a variable, like 'count', to keep track of the number of user interactions (taps) and determine the program's next action, such as which shape to draw.
294	23	Creating Custom Blocks (My Blocks)	{"Creating custom blocks without inputs (e.g., 'choose shape', 'draw pattern') to encapsulate and name a sequence of commands. This demonstrates procedural abstraction and helps organize code."}	Creating custom blocks without inputs (e.g., 'choose shape', 'draw pattern') to encapsulate and name a sequence of commands. This demonstrates procedural abstraction and helps organize code.
295	23	Custom Blocks with Parameters	{"Defining a custom block that accepts an input or parameter, such as 'length' in the 'Draw shape' block, to make the function more flexible and reusable for drawing shapes of different sizes."}	Defining a custom block that accepts an input or parameter, such as 'length' in the 'Draw shape' block, to make the function more flexible and reusable for drawing shapes of different sizes.
296	23	Conditional Logic for Selection	{"Using 'if-then' blocks to make decisions. For example, checking the value of the 'count' variable to decide which shape's properties (like the number of edges) to set or which pattern function to call."}	Using 'if-then' blocks to make decisions. For example, checking the value of the 'count' variable to decide which shape's properties (like the number of edges) to set or which pattern function to call.
297	23	Pen Extension for Drawing	{"Utilizing blocks from the Pen extension like 'pen down', 'pen up', 'erase all', and 'set pen color' to draw geometric shapes and patterns on the stage."}	Utilizing blocks from the Pen extension like 'pen down', 'pen up', 'erase all', and 'set pen color' to draw geometric shapes and patterns on the stage.
298	23	Using Operators for Geometric Calculations	{"Applying mathematical operators, specifically division, to calculate geometric properties. For example, finding the turn angle for a regular polygon using the formula '360 / edges'."}	Applying mathematical operators, specifically division, to calculate geometric properties. For example, finding the turn angle for a regular polygon using the formula '360 / edges'.
299	23	Event-Driven Programming (Mouse Click)	{"Detecting a user's mouse click as an event to trigger a sequence of actions, such as drawing a shape at the mouse's location."}	Detecting a user's mouse click as an event to trigger a sequence of actions, such as drawing a shape at the mouse's location.
300	23	Click Detection within a Loop	{"Implementing a sequence of 'wait until <not <mouse down?>>' and 'wait until <mouse down?>>' inside a 'forever' loop to register a single, complete click, preventing the code from running repeatedly while the mouse is held down."}	Implementing a sequence of 'wait until <not <mouse down?>>' and 'wait until <mouse down?>>' inside a 'forever' loop to register a single, complete click, preventing the code from running repeatedly while the mouse is held down.
301	23	Creating a Cyclical Sequence	{"Incrementing a counter variable with each event and using a conditional statement ('if count = 4 then set count to 1') to reset it. This creates a repeating cycle of actions, like drawing a triangle, then a square, then a hexagon, and then a triangle again."}	Incrementing a counter variable with each event and using a conditional statement ('if count = 4 then set count to 1') to reset it. This creates a repeating cycle of actions, like drawing a triangle, then a square, then a hexagon, and then a triangle again.
302	23	Cloning for Pattern Generation	{"Using the 'create clone of myself' block within a loop to generate multiple copies of a sprite, which are then used as building blocks for intricate fractal-like patterns such as snowflakes or honeycombs."}	Using the 'create clone of myself' block within a loop to generate multiple copies of a sprite, which are then used as building blocks for intricate fractal-like patterns such as snowflakes or honeycombs.
303	23	Broadcast and Receive for Clone Communication	{"Using 'broadcast' and 'when I receive' blocks to send messages ('Draw edge', 'kill clones') that trigger scripts in all clones simultaneously, allowing for synchronized and coordinated behavior."}	Using 'broadcast' and 'when I receive' blocks to send messages ('Draw edge', 'kill clones') that trigger scripts in all clones simultaneously, allowing for synchronized and coordinated behavior.
304	23	Clone Lifecycle Management	{"Using the 'delete this clone' block, often triggered by a broadcast message, to properly remove clones after they have completed their task. This is crucial for performance and preventing the project from exceeding the clone limit."}	Using the 'delete this clone' block, often triggered by a broadcast message, to properly remove clones after they have completed their task. This is crucial for performance and preventing the project from exceeding the clone limit.
305	23	Program Initialization	{"Setting up the initial state of the program under a 'when green flag clicked' event, including clearing the stage with 'erase all' and setting variables like 'count' to a starting value."}	Setting up the initial state of the program under a 'when green flag clicked' event, including clearing the stage with 'erase all' and setting variables like 'count' to a starting value.
306	23	Procedural Decomposition	{"Breaking down a complex task (drawing a sequence of magic patterns) into smaller, manageable sub-tasks, each implemented as a separate custom block ('choose Pattern', 'Draw Pattern', 'snowflake', etc.)."}	Breaking down a complex task (drawing a sequence of magic patterns) into smaller, manageable sub-tasks, each implemented as a separate custom block ('choose Pattern', 'Draw Pattern', 'snowflake', etc.).
307	23	Sensing Mouse Position	{"Employing the 'go to mouse-pointer' block from the Motion category to make the sprite's drawing action occur at the user's cursor location, making the program interactive."}	Employing the 'go to mouse-pointer' block from the Motion category to make the sprite's drawing action occur at the user's cursor location, making the program interactive.
308	24	Microphone Input with 'loudness'	{"Using the 'loudness' sensing block inside a conditional statement to trigger actions based on the volume of sound detected by the microphone. In the project, this is used to 'blow away' the fire from the Earth."}	Using the 'loudness' sensing block inside a conditional statement to trigger actions based on the volume of sound detected by the microphone. In the project, this is used to 'blow away' the fire from the Earth.
309	24	Conditional Size Change	{"Using an 'if' block to check the 'size' property of a sprite and trigger an action, such as hiding the sprite when it becomes smaller than a certain value."}	Using an 'if' block to check the 'size' property of a sprite and trigger an action, such as hiding the sprite when it becomes smaller than a certain value.
310	24	Event Handling with Broadcast and Receive	{"Using 'broadcast' blocks to send messages and 'when I receive' hat blocks to trigger new scripts when a specific event occurs, such as moving from the fire scene to the tree planting scene."}	Using 'broadcast' blocks to send messages and 'when I receive' hat blocks to trigger new scripts when a specific event occurs, such as moving from the fire scene to the tree planting scene.
311	24	Variable Initialization and Incrementing	{"Creating a variable to keep track of a value (e.g., 'tree count'), setting its initial value using the 'set variable to' block, and updating it within a loop using the 'change variable by' block."}	Creating a variable to keep track of a value (e.g., 'tree count'), setting its initial value using the 'set variable to' block, and updating it within a loop using the 'change variable by' block.
312	24	Conditional Logic with Variables	{"Using a variable within a conditional statement (e.g., 'if tree count = 10 then') to execute a block of code once a specific condition is met, like broadcasting a message after 10 trees are planted."}	Using a variable within a conditional statement (e.g., 'if tree count = 10 then') to execute a block of code once a specific condition is met, like broadcasting a message after 10 trees are planted.
313	24	Mouse Input for Drawing	{"Detecting mouse clicks with the 'mouse down?' block inside a 'forever' loop and using 'go to mouse-pointer' to position the sprite for drawing at the cursor's location."}	Detecting mouse clicks with the 'mouse down?' block inside a 'forever' loop and using 'go to mouse-pointer' to position the sprite for drawing at the cursor's location.
314	24	Creating Custom Blocks (Procedures)	{"Defining custom blocks (My Blocks) like 'draw trunk' and 'draw leaves' to organize code into reusable procedures, demonstrating abstraction."}	Defining custom blocks (My Blocks) like 'draw trunk' and 'draw leaves' to organize code into reusable procedures, demonstrating abstraction.
315	24	Using the Pen Extension	{"Utilizing blocks from the Pen extension like 'pen down', 'pen up', 'set pen color', and 'set pen size' to programmatically draw on the stage."}	Utilizing blocks from the Pen extension like 'pen down', 'pen up', 'set pen color', and 'set pen size' to programmatically draw on the stage.
316	24	Stamping Sprites	{"Using the 'stamp' block from the Pen extension to create a permanent image of a sprite's costume (like the tree leaves) on the stage at its current position."}	Using the 'stamp' block from the Pen extension to create a permanent image of a sprite's costume (like the tree leaves) on the stage at its current position.
317	24	Sprite Cloning	{"Using the 'create clone of myself' block, often inside a loop, to generate multiple instances of a sprite, as seen with the CO2 bubbles."}	Using the 'create clone of myself' block, often inside a loop, to generate multiple instances of a sprite, as seen with the CO2 bubbles.
318	24	Programming Clone Behavior	{"Using the 'when I start as a clone' hat block to define the specific actions and scripts that cloned sprites will execute, independently of the original sprite."}	Using the 'when I start as a clone' hat block to define the specific actions and scripts that cloned sprites will execute, independently of the original sprite.
319	24	Collision Detection	{"Using the 'touching [sprite]?' sensing block within a conditional to detect when one sprite (a CO2 clone) makes contact with another (a Tree)."}	Using the 'touching [sprite]?' sensing block within a conditional to detect when one sprite (a CO2 clone) makes contact with another (a Tree).
320	24	Sprite Animation with Motion Blocks	{"Creating movement and animation by placing motion blocks like 'change x by' or 'glide to' inside a 'forever' loop to make sprites move continuously."}	Creating movement and animation by placing motion blocks like 'change x by' or 'glide to' inside a 'forever' loop to make sprites move continuously.
321	24	Scene Transitions with Backdrops	{"Using the 'switch backdrop to' block to change the stage's appearance, effectively transitioning between different scenes or states of the project."}	Using the 'switch backdrop to' block to change the stage's appearance, effectively transitioning between different scenes or states of the project.
322	24	Managing Sprite Layers	{"Using the 'go to back layer' block to control the visual stacking order of sprites, ensuring one sprite appears behind others on the stage."}	Using the 'go to back layer' block to control the visual stacking order of sprites, ensuring one sprite appears behind others on the stage.
\.


--
-- Data for Name: concept_grade_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.concept_grade_mapping (concept_id, grade) FROM stdin;
1	3
1	4
1	5
1	6
1	7
2	4
2	5
2	6
2	7
2	8
2	9
3	5
3	6
3	7
3	8
3	9
3	10
4	5
4	6
4	7
4	8
4	9
4	10
5	6
5	7
5	8
5	9
5	10
5	11
5	12
6	6
6	7
6	8
6	9
6	10
6	11
6	12
7	4
7	5
7	6
7	7
7	8
7	9
8	4
8	5
8	6
8	7
8	8
8	9
9	7
9	8
9	9
9	10
9	11
9	12
10	3
10	4
10	5
10	6
10	7
10	8
11	5
11	6
11	7
11	8
11	9
12	1
12	2
12	3
12	4
12	5
13	1
13	2
13	3
13	4
13	5
14	3
14	4
14	5
14	6
14	7
15	3
15	4
15	5
15	6
15	7
16	4
16	5
16	6
16	7
16	8
17	4
17	5
17	6
17	7
17	8
18	5
18	6
18	7
18	8
18	9
19	6
19	7
19	8
19	9
19	10
20	3
20	4
20	5
20	6
20	7
20	8
21	6
21	7
21	8
21	9
21	10
22	5
22	6
22	7
22	8
22	9
23	4
23	5
23	6
23	7
23	8
24	6
24	7
24	8
24	9
24	10
25	3
25	4
25	5
25	6
25	7
26	3
26	4
26	5
26	6
26	7
27	3
27	4
27	5
27	6
27	7
28	3
28	4
28	5
28	6
28	7
29	4
29	5
29	6
29	7
29	8
30	4
30	5
30	6
30	7
30	8
31	4
31	5
31	6
31	7
31	8
32	5
32	6
32	7
32	8
32	9
33	3
33	4
33	5
33	6
33	7
34	3
34	4
34	5
34	6
34	7
35	4
35	5
35	6
35	7
35	8
36	1
36	2
36	3
36	4
36	5
37	1
37	2
37	3
37	4
37	5
38	3
38	4
38	5
38	6
38	7
39	4
39	5
39	6
39	7
39	8
40	5
40	6
40	7
40	8
40	9
41	4
41	5
41	6
41	7
41	8
42	5
42	6
42	7
42	8
42	9
43	5
43	6
43	7
43	8
43	9
44	5
44	6
44	7
44	8
44	9
45	6
45	7
45	8
45	9
45	10
46	7
46	8
46	9
46	10
46	11
46	12
47	7
47	8
47	9
47	10
47	11
47	12
48	8
48	9
48	10
48	11
48	12
49	4
49	5
49	6
49	7
49	8
50	5
50	6
50	7
50	8
50	9
51	3
51	4
51	5
51	6
51	7
51	8
52	4
52	5
52	6
52	7
52	8
52	9
53	6
53	7
53	8
53	9
53	10
54	6
54	7
54	8
54	9
54	10
55	7
55	8
55	9
55	10
55	11
55	12
56	5
56	6
56	7
56	8
56	9
56	10
57	7
57	8
57	9
57	10
57	11
57	12
58	4
58	5
58	6
58	7
58	8
59	6
59	7
59	8
59	9
59	10
59	11
60	5
60	6
60	7
60	8
60	9
60	10
61	3
61	4
61	5
61	6
61	7
62	4
62	5
62	6
62	7
62	8
62	9
63	4
63	5
63	6
63	7
63	8
63	9
64	3
64	4
64	5
64	6
64	7
64	8
65	4
65	5
65	6
65	7
65	8
66	3
66	4
66	5
66	6
66	7
67	5
67	6
67	7
67	8
67	9
68	6
68	7
68	8
68	9
68	10
69	4
69	5
69	6
69	7
69	8
70	4
70	5
70	6
70	7
70	8
71	3
71	4
71	5
71	6
71	7
72	3
72	4
72	5
72	6
72	7
73	6
73	7
73	8
73	9
73	10
74	5
74	6
74	7
74	8
74	9
75	5
75	6
75	7
75	8
75	9
76	7
76	8
76	9
76	10
76	11
77	5
77	6
77	7
77	8
77	9
77	10
77	11
77	12
78	5
78	6
78	7
78	8
79	6
79	7
79	8
79	9
80	4
80	5
80	6
80	7
81	6
81	7
81	8
81	9
81	10
82	5
82	6
82	7
82	8
82	9
83	7
83	8
83	9
83	10
83	11
83	12
84	6
84	7
84	8
84	9
84	10
85	7
85	8
85	9
85	10
85	11
86	4
86	5
86	6
86	7
86	8
87	6
87	7
87	8
87	9
87	10
88	4
88	5
88	6
88	7
89	5
89	6
89	7
89	8
89	9
90	6
90	7
90	8
90	9
90	10
91	3
91	4
91	5
91	6
91	7
91	8
92	3
92	4
92	5
92	6
92	7
92	8
93	5
93	6
93	7
93	8
93	9
93	10
94	3
94	4
94	5
94	6
94	7
94	8
95	5
95	6
95	7
95	8
95	9
95	10
96	5
96	6
96	7
96	8
96	9
96	10
97	6
97	7
97	8
97	9
97	10
97	11
98	7
98	8
98	9
98	10
98	11
98	12
99	7
99	8
99	9
99	10
99	11
99	12
100	7
100	8
100	9
100	10
100	11
100	12
101	1
101	2
101	3
101	4
101	5
101	6
101	7
101	8
102	6
102	7
102	8
102	9
102	10
102	11
102	12
103	5
103	6
103	7
103	8
103	9
103	10
104	5
104	6
104	7
104	8
105	6
105	7
105	8
105	9
106	7
106	8
106	9
106	10
107	6
107	7
107	8
107	9
107	10
108	6
108	7
108	8
108	9
108	10
109	5
109	6
109	7
109	8
109	9
110	5
110	6
110	7
110	8
110	9
111	7
111	8
111	9
111	10
111	11
111	12
112	7
112	8
112	9
112	10
112	11
112	12
113	5
113	6
113	7
113	8
113	9
113	10
113	11
113	12
114	6
114	7
114	8
114	9
114	10
114	11
114	12
115	7
115	8
115	9
115	10
115	11
115	12
116	4
116	5
116	6
116	7
117	5
117	6
117	7
117	8
118	6
118	7
118	8
118	9
119	7
119	8
119	9
119	10
120	6
120	7
120	8
120	9
121	7
121	8
121	9
121	10
122	5
122	6
122	7
122	8
123	6
123	7
123	8
123	9
124	7
124	8
124	9
124	10
124	11
125	6
125	7
125	8
125	9
125	10
126	4
126	5
126	6
126	7
126	8
127	6
127	7
127	8
127	9
128	3
128	4
128	5
128	6
128	7
128	8
129	1
129	2
129	3
129	4
129	5
130	4
130	5
130	6
130	7
130	8
130	9
131	3
131	4
131	5
131	6
131	7
131	8
132	4
132	5
132	6
132	7
132	8
132	9
133	4
133	5
133	6
133	7
133	8
133	9
134	3
134	4
134	5
134	6
134	7
134	8
135	4
135	5
135	6
135	7
135	8
135	9
136	5
136	6
136	7
136	8
136	9
136	10
137	4
137	5
137	6
137	7
137	8
137	9
138	4
138	5
138	6
138	7
138	8
138	9
139	6
139	7
139	8
139	9
139	10
140	3
140	4
140	5
140	6
140	7
141	3
141	4
141	5
141	6
141	7
142	4
142	5
142	6
142	7
142	8
143	5
143	6
143	7
143	8
143	9
143	10
144	3
144	4
144	5
144	6
144	7
144	8
145	4
145	5
145	6
145	7
145	8
145	9
146	2
146	3
146	4
146	5
146	6
147	1
147	2
147	3
147	4
147	5
148	5
148	6
148	7
148	8
148	9
149	5
149	6
149	7
149	8
149	9
149	10
149	11
149	12
150	3
150	4
150	5
150	6
150	7
150	8
151	4
151	5
151	6
151	7
151	8
151	9
152	3
152	4
152	5
152	6
152	7
153	4
153	5
153	6
153	7
154	3
154	4
154	5
154	6
155	5
155	6
155	7
155	8
155	9
156	3
156	4
156	5
156	6
156	7
157	3
157	4
157	5
157	6
157	7
158	5
158	6
158	7
158	8
158	9
159	5
159	6
159	7
159	8
159	9
160	4
160	5
160	6
160	7
160	8
161	5
161	6
161	7
161	8
161	9
162	6
162	7
162	8
162	9
162	10
163	5
163	6
163	7
163	8
163	9
164	5
164	6
164	7
164	8
164	9
165	4
165	5
165	6
165	7
165	8
166	7
166	8
166	9
166	10
166	11
166	12
167	3
167	4
167	5
167	6
167	7
168	2
168	3
168	4
168	5
168	6
169	5
169	6
169	7
169	8
169	9
170	4
170	5
170	6
170	7
170	8
171	3
171	4
171	5
171	6
171	7
172	4
172	5
172	6
172	7
172	8
173	4
173	5
173	6
173	7
173	8
174	5
174	6
174	7
174	8
174	9
175	3
175	4
175	5
175	6
175	7
176	5
176	6
176	7
176	8
176	9
177	6
177	7
177	8
177	9
177	10
178	6
178	7
178	8
178	9
178	10
179	3
179	4
179	5
179	6
179	7
180	3
180	4
180	5
180	6
180	7
181	4
181	5
181	6
181	7
181	8
182	4
182	5
182	6
182	7
182	8
183	5
183	6
183	7
183	8
183	9
184	5
184	6
184	7
184	8
184	9
185	6
185	7
185	8
185	9
185	10
186	5
186	6
186	7
186	8
186	9
187	4
187	5
187	6
187	7
187	8
188	3
188	4
188	5
188	6
188	7
189	3
189	4
189	5
189	6
189	7
190	4
190	5
190	6
190	7
190	8
191	3
191	4
191	5
191	6
192	3
192	4
192	5
192	6
193	3
193	4
193	5
193	6
193	7
194	4
194	5
194	6
194	7
194	8
195	2
195	3
195	4
195	5
195	6
196	3
196	4
196	5
196	6
196	7
197	3
197	4
197	5
197	6
197	7
198	2
198	3
198	4
198	5
199	3
199	4
199	5
199	6
200	4
200	5
200	6
200	7
200	8
201	2
201	3
201	4
201	5
202	3
202	4
202	5
202	6
202	7
203	3
203	4
203	5
203	6
203	7
204	3
204	4
204	5
204	6
204	7
205	5
205	6
205	7
205	8
206	5
206	6
206	7
206	8
207	1
207	2
207	3
207	4
207	5
207	6
207	7
207	8
208	5
208	6
208	7
208	8
209	1
209	2
209	3
209	4
210	5
210	6
210	7
210	8
211	5
211	6
211	7
211	8
212	5
212	6
212	7
212	8
213	5
213	6
213	7
213	8
213	9
213	10
213	11
213	12
214	5
214	6
214	7
214	8
215	5
215	6
215	7
215	8
215	9
215	10
215	11
215	12
216	1
216	2
216	3
216	4
216	5
216	6
216	7
216	8
217	9
217	10
217	11
217	12
218	1
218	2
218	3
218	4
219	5
219	6
219	7
219	8
219	9
219	10
219	11
219	12
220	5
220	6
220	7
220	8
221	1
221	2
221	3
221	4
221	5
221	6
221	7
221	8
222	5
222	6
222	7
222	8
223	1
223	2
223	3
223	4
224	5
224	6
224	7
224	8
225	5
225	6
225	7
225	8
226	5
226	6
226	7
226	8
226	9
226	10
226	11
226	12
227	1
227	2
227	3
227	4
228	1
228	2
228	3
228	4
229	1
229	2
229	3
229	4
229	5
229	6
229	7
229	8
230	5
230	6
230	7
230	8
231	5
231	6
231	7
231	8
232	5
232	6
232	7
232	8
233	1
233	2
233	3
233	4
233	5
233	6
233	7
233	8
234	1
234	2
234	3
234	4
234	5
234	6
234	7
234	8
235	5
235	6
235	7
235	8
236	5
236	6
236	7
236	8
237	5
237	6
237	7
237	8
238	5
238	6
238	7
238	8
238	9
238	10
238	11
238	12
239	5
239	6
239	7
239	8
239	9
239	10
239	11
239	12
240	5
240	6
240	7
240	8
241	1
241	2
241	3
241	4
241	5
241	6
241	7
241	8
242	5
242	6
242	7
242	8
243	1
243	2
243	3
243	4
243	5
243	6
243	7
243	8
244	1
244	2
244	3
244	4
244	5
244	6
244	7
244	8
245	5
245	6
245	7
245	8
246	5
246	6
246	7
246	8
247	5
247	6
247	7
247	8
247	9
247	10
247	11
247	12
248	1
248	2
248	3
248	4
248	5
248	6
248	7
248	8
249	5
249	6
249	7
249	8
250	1
250	2
250	3
250	4
250	5
250	6
250	7
250	8
251	5
251	6
251	7
251	8
252	5
252	6
252	7
252	8
252	9
252	10
252	11
252	12
253	5
253	6
253	7
253	8
254	5
254	6
254	7
254	8
255	5
255	6
255	7
255	8
255	9
255	10
255	11
255	12
256	1
256	2
256	3
256	4
256	5
256	6
256	7
256	8
257	1
257	2
257	3
257	4
257	5
257	6
257	7
257	8
258	5
258	6
258	7
258	8
259	1
259	2
259	3
259	4
259	5
259	6
259	7
259	8
260	5
260	6
260	7
260	8
261	1
261	2
261	3
261	4
261	5
261	6
261	7
261	8
262	5
262	6
262	7
262	8
262	9
262	10
262	11
262	12
263	5
263	6
263	7
263	8
263	9
263	10
263	11
263	12
264	5
264	6
264	7
264	8
264	9
264	10
264	11
264	12
265	5
265	6
265	7
265	8
265	9
265	10
265	11
265	12
266	5
266	6
266	7
266	8
266	9
266	10
266	11
266	12
267	5
267	6
267	7
267	8
268	1
268	2
268	3
268	4
268	5
268	6
268	7
268	8
269	1
269	2
269	3
269	4
269	5
269	6
269	7
269	8
270	1
270	2
270	3
270	4
270	5
270	6
270	7
270	8
271	5
271	6
271	7
271	8
271	9
271	10
271	11
271	12
272	5
272	6
272	7
272	8
273	5
273	6
273	7
273	8
274	5
274	6
274	7
274	8
274	9
274	10
274	11
274	12
275	5
275	6
275	7
275	8
276	5
276	6
276	7
276	8
276	9
276	10
276	11
276	12
277	9
277	10
277	11
277	12
278	1
278	2
278	3
278	4
278	5
278	6
278	7
278	8
279	5
279	6
279	7
279	8
280	1
280	2
280	3
280	4
280	5
280	6
280	7
280	8
281	5
281	6
281	7
281	8
282	5
282	6
282	7
282	8
282	9
282	10
282	11
282	12
283	5
283	6
283	7
283	8
283	9
283	10
283	11
283	12
284	5
284	6
284	7
284	8
285	1
285	2
285	3
285	4
285	5
285	6
285	7
285	8
286	1
286	2
286	3
286	4
286	5
286	6
286	7
286	8
287	1
287	2
287	3
287	4
287	5
287	6
287	7
287	8
288	1
288	2
288	3
288	4
288	5
288	6
288	7
288	8
288	9
288	10
288	11
288	12
289	5
289	6
289	7
289	8
290	1
290	2
290	3
290	4
290	5
290	6
290	7
290	8
291	5
291	6
291	7
291	8
291	9
291	10
291	11
291	12
292	5
292	6
292	7
292	8
292	9
292	10
292	11
292	12
293	5
293	6
293	7
293	8
294	5
294	6
294	7
294	8
295	5
295	6
295	7
295	8
295	9
295	10
295	11
295	12
296	5
296	6
296	7
296	8
297	1
297	2
297	3
297	4
297	5
297	6
297	7
297	8
298	5
298	6
298	7
298	8
299	5
299	6
299	7
299	8
300	5
300	6
300	7
300	8
300	9
300	10
300	11
300	12
301	5
301	6
301	7
301	8
302	9
302	10
302	11
302	12
303	9
303	10
303	11
303	12
304	9
304	10
304	11
304	12
305	1
305	2
305	3
305	4
305	5
305	6
305	7
305	8
306	5
306	6
306	7
306	8
306	9
306	10
306	11
306	12
307	1
307	2
307	3
307	4
307	5
307	6
307	7
307	8
308	5
308	6
308	7
308	8
309	5
309	6
309	7
309	8
310	5
310	6
310	7
310	8
311	5
311	6
311	7
311	8
312	5
312	6
312	7
312	8
313	5
313	6
313	7
313	8
314	5
314	6
314	7
314	8
314	9
314	10
314	11
314	12
315	5
315	6
315	7
315	8
315	9
315	10
315	11
315	12
316	1
316	2
316	3
316	4
316	5
316	6
316	7
316	8
317	5
317	6
317	7
317	8
317	9
317	10
317	11
317	12
318	5
318	6
318	7
318	8
318	9
318	10
318	11
318	12
319	5
319	6
319	7
319	8
320	1
320	2
320	3
320	4
320	5
320	6
320	7
320	8
321	1
321	2
321	3
321	4
321	5
321	6
321	7
321	8
322	1
322	2
322	3
322	4
322	5
322	6
322	7
322	8
\.


--
-- Data for Name: question_sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.question_sets (id, submodule_id, grade, set_name, is_hidden, reattempts_allowed, created_at) FROM stdin;
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.questions (id, concept_id, grade, question_text, question_type, options, correct_answer, bloom_level, image_path, explanation, scratch_text) FROM stdin;
\.


--
-- Data for Name: question_set_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.question_set_items (set_id, question_id) FROM stdin;
\.


--
-- Data for Name: quiz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz (username, quiz_data) FROM stdin;
mock_student22	{"multiple_choice":[{"question":"In the Scratch environment, what is the primary function of the 'forever' block?","options":["To execute a block of code a specified number of times.","To execute a block of code only when a certain condition is met.","To execute a block of code indefinitely, creating an infinite loop.","To stop the execution of a script."],"answer":"To execute a block of code indefinitely, creating an infinite loop.","explanation":"The 'forever' block in Scratch continuously repeats the blocks inside it, creating an infinite loop, where the action keeps repeating continuously.","bloom_level":"Remembering","concept":"Forever loop","needs_image":false,"grade":"secondary"},{"question":"Eshal is coded to move 10 steps within a 'forever' loop. To prevent him from moving endlessly across the screen, which block would be most effective to use?","options":["'stop this script'","'if on edge, bounce'","'wait 1 seconds'","'change x by 10'"],"answer":"'if on edge, bounce'","explanation":"The 'if on edge, bounce' block will change Eshal's direction when he reaches the edge of the screen, keeping him within the visible area and avoiding an endless movement off-screen.","bloom_level":"Applying","concept":"Edge detection","needs_image":false,"grade":"secondary"},{"question":"In the context of Eshal's emotional coding project, what programming construct allows different 'Eshal' sprites (Sad, Angry, Balanced, Compassionate) to trigger each other in a sequence?","options":["Variables","Broadcast events","Conditional statements","Loops"],"answer":"Broadcast events","explanation":"Broadcast events enable sprites to communicate with each other. When one sprite broadcasts a message (e.g., 'I am sad'), other sprites that are programmed to receive that message can then perform specific actions.","bloom_level":"Understanding","concept":"Broadcast events","needs_image":false,"grade":"secondary"},{"question":"Why is it beneficial to initialize the 'emotion' variable to 'sad' at the beginning of the 'Sad Eshal' sprite's code?","options":["To make the code run faster.","To set a starting value for the variable, representing Eshal's initial emotional state.","To prevent errors in the code.","To display the word 'sad' on the screen."],"answer":"To set a starting value for the variable, representing Eshal's initial emotional state.","explanation":"Initializing the variable gives it a defined starting value, making the code predictable and easier to manage as the emotion variable changes throughout the program's execution. It sets the initial state for the program's logic.","bloom_level":"Applying","concept":"Variable initialization","needs_image":false,"grade":"secondary"},{"question":"When coding for Eshal's emotions, using a single 'emotion' variable to represent different emotional states (sad, angry, balanced, compassionate) is more efficient than using separate broadcast messages for each emotion because:","options":["It reduces the amount of code needed and simplifies the program's logic.","It makes the program run faster.","It makes the program easier to debug.","It allows the program to display multiple emotions at once."],"answer":"It reduces the amount of code needed and simplifies the program's logic.","explanation":"Using a single variable to store changing emotions allows the computer to store this variable in its memory and only provides the updated value at any given point, making the coding process easier and more efficient.","bloom_level":"Analyzing","concept":"Variable efficiency","needs_image":false,"grade":"secondary"},{"question":"In the thought-catching project, what is the significance of training a machine learning model with equal numbers of positive and negative examples?","options":["To make the model run faster.","To ensure that the model learns to classify both types of thoughts accurately, avoiding bias towards one category.","To reduce the amount of memory required by the model.","To make the model easier to understand."],"answer":"To ensure that the model learns to classify both types of thoughts accurately, avoiding bias towards one category.","explanation":"Providing an equal number of examples for positive and negative thoughts prevents the machine learning model from being biased towards one category, ensuring that it learns to classify both types of thoughts accurately. This is crucial for unbiased predictions.","bloom_level":"Evaluating","concept":"Machine learning bias","needs_image":false,"grade":"secondary"},{"question":"Considering the process of creating a snow dance animation, why is it more efficient to use clones for generating snowflakes instead of manually creating hundreds of individual snowflake sprites?","options":["Clones make the animation run faster.","Clones allow you to create many similar sprites while using fewer resources, as they share the same basic properties and code.","Clones make the animation easier to debug.","Clones allow you to create snowflakes of different shapes and sizes."],"answer":"Clones allow you to create many similar sprites while using fewer resources, as they share the same basic properties and code.","explanation":"Clones are copies of an original sprite that share the same code and properties, but can have different positions, sizes, and other characteristics. This makes them a more efficient way to create many similar objects in a Scratch project, as they use less memory and processing power than individual sprites.","bloom_level":"Analyzing","concept":"Clones efficiency","needs_image":false,"grade":"secondary"}],"true_false":[{"question":"According to Charles Darwin, emotions developed in animals primarily for aesthetic purposes and social bonding.","answer":"False","explanation":"Charles Darwin proposed that animals developed emotions primarily for survival and to prevent themselves from undesirable situations, such as disgust preventing them from eating bad food.","bloom_level":"Understanding","concept":"Emotion evolution","needs_image":false,"grade":"secondary"},{"question":"In coding, the 'else-if' condition is always checked, regardless of whether the preceding 'if' condition is true or false.","answer":"False","explanation":"In an 'else-if' ladder, only the first 'if' block is checked initially. If that condition is false, then the subsequent 'else-if' blocks are checked, but only until a true condition is found or all conditions are exhausted.","bloom_level":"Understanding","concept":"Else-if condition","needs_image":true,"grade":"secondary"},{"question":"According to the lesson, one way to approach complex coding tasks is to break them down into smaller, more manageable parts, address each part individually, and then combine the solutions. This approach is known as decomposition.","answer":"True","explanation":"The lesson explicitly describes 'decomposition' as dividing a problem into smaller tasks to work with and working on one task at a time to later combine the solution for a bigger problem, a technique used by professional coders.","bloom_level":"Understanding","concept":"Decomposition","needs_image":false,"grade":"secondary"}]}
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, username, email, password_hash, grade, created_at) FROM stdin;
\.


--
-- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quiz_attempts (id, student_username, question_set_id, submitted_at, score, total_questions, answers_json) FROM stdin;
\.


--
-- Data for Name: student_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_activity (id, student_username, submodule_id, grade, attempt_ids, concept_performance, last_attempt_at) FROM stdin;
\.


--
-- Data for Name: student_concept_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_concept_stats (id, student_username, concept_id, grade, submodule_id, correct_count, incorrect_count, last_updated) FROM stdin;
\.


--
-- Data for Name: supermodules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supermodules (id, supermodule_code, supermodule_name) FROM stdin;
1	Level-1	Computer Science Principles
2	Level-2	Problem Solving & Thinking Skills
3	Level-3	Let's Code
\.


--
-- Data for Name: supermodule_submodules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supermodule_submodules (supermodule_id, submodule_id) FROM stdin;
1	1
1	2
1	3
1	4
1	5
1	6
1	7
1	8
1	9
2	10
2	11
2	12
2	13
2	14
2	15
2	16
3	17
3	18
3	19
3	20
3	21
3	22
3	23
3	24
\.


--
-- Name: concepts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.concepts_id_seq', 322, true);


--
-- Name: question_sets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.question_sets_id_seq', 1, false);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.questions_id_seq', 1, false);


--
-- Name: quiz_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quiz_attempts_id_seq', 1, false);


--
-- Name: student_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_activity_id_seq', 1, false);


--
-- Name: student_concept_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_concept_stats_id_seq', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 1, false);


--
-- Name: submodules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.submodules_id_seq', 24, true);


--
-- Name: supermodules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supermodules_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict aZwE6elWqrMOThm0MiW34tOJ0O8wf1aMXTRum4n89thxXVlss5v5BIzYafVYUEG

