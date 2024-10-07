import '../styles/testimonials/one.scss'

const TestimonialsOne = () => {
  return (
    <>
   <div className="testimonials__one__container">
    <div className="testimonials__one__wrapper">
      <div className="testimonials__one__text">
        <h1 className='testimonials__one__review'>
        At this point I’m just in awe at this platform. From the emails keeping in touch and even the guidiance. What a wonderful opportunity to help my family and become the earner I know I can be. 5 stars
        </h1>

        <span className='testimonials__one__user'>
          <p className='testimonials__one__user__name'> -Renee Wells</p>
          <p className='testimonials__one__user__title'>Product Designer, Quotient</p>
        </span>

        <span className='testimonials__one__icons'>
          <div className='testimonials__one__active'></div>
          <div className='testimonials__one__icon'></div>
          <div className='testimonials__one__icon'></div>
        </span>
      </div>


        <figure className='testimonials__one__figure'>
          <img src="/images/testimonial-one-model.png" alt="model" />
        </figure>
    </div>
   </div>
    </>
  )
}


export default TestimonialsOne