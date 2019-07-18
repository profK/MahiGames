# MahiGames
This project is  my skills assesment for Mahi games.  I have  implemented a basic
slot machine and a wheel of fortune type game.

Both games are setup to be run locally by double clicking on 
SlotTest/MahiGames/slot.html and SlotTest/MahiGames/Wheel.html

The HTMl files are minimal shells, with all game code beign in the Typescript tree.
The organiztion of that tree is as follows:

apps -> SlotMachine.ts
        WheelOfFish.ts
        assets -> all game art and audio
        System->  Graphics2D.ts (This is the primary engine interface)
        Matrix2D.ts
        Vector2.ts
        Rect.ts
        Sprite.ts (an interface implemented  by all drawables)
        NumericalMapper.ts (an interface implemnted by animation controllign functions)
	tests -> UnitTest1.ts (a test for the Matrix2D math)
        Sprites-> SimpleImageSprite.ts
                  ScrollingImageSprite.ts (used for the slot reels)
                  SpinningSprite.ts (a super class used by AcceleratingSpinningSprite.ts)
		  AcceleratingImageSprite.ts (used  by Wheel of Fish)
                  TextSprite.ts  (an early and usable-with-issues text render sprite) 
                  AutoCenterTextSprite (a sub-class of TextSprite that centers on its origin)
                  ExponentialMapper.ts (an experimental animation timing controller)
                  ArcsinMapper.ts (the animation controller used in Wheel of Fish)


All code gets built into application.js in Slotest/MahiGames

UML sequence and object hirearchy diagrams are in SlotTest/MahiGames/docs

There are some Visual Studio projects layign around the project but as I moved to WebStorm
part way through I can't gaurantee their correctness.  The code does build under Webstorm using 
the butil-in TypeScript compiler.

SlotMachine:

Slot machine is a basic 4 reel slot.  Although the code is all browser-resident it is driven
by a quadruple of values that the reels will land on that could easily be provided from
a server.  It is resizable and automatically adjusts for any reasonably sized screen.

See the game and engine code for detaisl on how it works.

Future work would include real art, more sounds, button animation and an exciting pay off animation.

Wheel of Fish:

Wheel of fish is a basic wheel of fortune game with a wheel that accelerates and decelearates
This is a wheel of fortune game with an accelerating and decelerating wheel and a funny
comment (okay a terrible  pun) for each fish result.

It is built on the same underlying graphics engine as Slot Machine and also readjusts for size change.

See the game and engine details.

Wheel of Fish does have an issue with extremely non-square screens as the wheel distorts some.  This points to future work on a sprite type that corrects for apect-ration mis-matches.

Other future work would be to add sound and betting/payoff.

Github:

The entire project is hosted at https://github.com/profK/MahiGames.  You can see the evolution of the project by following the putbacks.


