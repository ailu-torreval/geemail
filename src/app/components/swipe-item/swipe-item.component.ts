import { getLocaleDirection } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Animation, AnimationController, GestureController, IonItem } from '@ionic/angular';

const ANIMATION_BREAKPOINT = 70;

@Component({
  selector: 'app-swipe-item',
  templateUrl: './swipe-item.component.html',
  styleUrls: ['./swipe-item.component.scss'],
})
export class SwipeItemComponent implements AfterViewInit {
  @Input('email') m: any;
  @ViewChild(IonItem, { read: ElementRef }) item: ElementRef;
  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('trash', { read: ElementRef }) trashIcon: ElementRef;
  @ViewChild('archive', { read: ElementRef }) archiveIcon: ElementRef;
  @Output() delete: EventEmitter<any> = new EventEmitter();

  bigIcon = false;

  trashAnimation: Animation;
  archiveAnimation: Animation;
  deleteAnimation: Animation;


  constructor(
    private router: Router,
    private gestureCtrl: GestureController,
    private animationCtrl: AnimationController
  ) {}

  ngAfterViewInit() {
    this.setupIconAnimations();
    const style = this.item.nativeElement.style;
    const windowWidth = window.innerWidth;

    this.deleteAnimation = this.animationCtrl.create('delete-animation')
    .addElement(this.item.nativeElement)
    .duration(300)
    .easing('ease-out')
    .fromTo('height', '72px', '0');


    const moveGesture = this.gestureCtrl.create({
      el: this.item.nativeElement,
      gestureName: 'move',
      threshold: 0,
      onStart: (ev) => {
        style.transition = '';
      },
      onMove: (ev) => {
        this.item.nativeElement.classList.add('rounded');
        style.transform = `translate3d(${ev.deltaX}px, 0, 0)`;

        if (ev.deltaX > 0) {
          this.wrapper.nativeElement.style['background-color'] =
            'var(--ion-color-danger)';
        } else if (ev.deltaX < 0) {
          this.wrapper.nativeElement.style['background-color'] =
            'var(--ion-color-success)';
        }

        if (ev.deltaX > ANIMATION_BREAKPOINT && !this.bigIcon) {
          console.log("delta bigger than Bp")
          this.animateTrash(true);
        } else if (ev.deltaX > 0 && ev.deltaX < ANIMATION_BREAKPOINT && this.bigIcon) {
          console.log("delta lower than Bp & bigger than 0")
          
          this.animateTrash(false);
        }
        
        if (ev.deltaX < -ANIMATION_BREAKPOINT && !this.bigIcon) {
          console.log(ev.deltaX);
          console.log("animate archive")
          this.animateArchive(true);
        } else if (ev.deltaX < 0 && ev.deltaX > -ANIMATION_BREAKPOINT && this.bigIcon) {
          console.log(ev.deltaX);
          this.animateArchive(false);
          console.log("dont animate archive")

        }

      },
      onEnd: (ev) => {
        this.item.nativeElement.classList.remove('rounded');
        style.transition = '0.2s ease-out';
        if (ev.deltaX > ANIMATION_BREAKPOINT) {
          style.transform = `translate3d(${windowWidth}px, 0, 0)`;
          this.deleteAnimation.play();
          this.deleteAnimation.onFinish(()=>{
            this.delete.emit(true);
          })

        } else if (ev.deltaX < -ANIMATION_BREAKPOINT) {
          style.transform = `translate3d(-${windowWidth}px, 0, 0)`;
          this.deleteAnimation.play();
          this.deleteAnimation.onFinish(()=>{
            this.delete.emit(true);
          })


        } else {
          style.transform = '';
        }
      },
    });
    moveGesture.enable();
  }

  setupIconAnimations () {
    this.trashAnimation = this.animationCtrl.create('trash-animation')
    .addElement(this.trashIcon.nativeElement)
    .duration(300)
    .easing('ease-in')
    .fromTo('transform', 'scale(1', 'scale(1.5');

    this.archiveAnimation = this.animationCtrl.create('archive-animation')
    .addElement(this.archiveIcon.nativeElement)
    .duration(300)
    .easing('ease-in')
    .fromTo('transform', 'scale(1)', 'scale(1.5)');

  }

  openMail(id) {
    this.router.navigate(['tabs', 'mail', id]);
  }

  animateTrash(zoomIn) {
    this.bigIcon = zoomIn;
    zoomIn ? this.trashAnimation.direction('alternate').play() : this.trashAnimation.direction('reverse').play();
    // Haptics.impact({style: ImpactStyle.Light});
  }

  animateArchive(zoomIn) {
    console.log("animateArchive", zoomIn)
    this.bigIcon = zoomIn;
    if(zoomIn) {
      console.log("alternate")
      this.archiveAnimation.direction('alternate').play()
    } else {
      console.log("reverse")

      this.archiveAnimation.direction('reverse').play();
    }
    // zoomIn ? this.archiveAnimation.direction('alternate').play() : this.archiveAnimation.direction('reverse').play();
    // Haptics.impact({style: ImpactStyle.Light})
  }
}
