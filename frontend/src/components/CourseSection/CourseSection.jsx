import "./CourseSection.css";

export default function CoursesSection() {
  return (
    <section className="courses-wrapper">

      {/* Title */}
      <h1 className="courses-title">Baking Courses</h1>
      <p className="courses-sub">
        Learn the art of baking from scratch — simple lessons, expert results!
      </p>

      {/* Course Boxes */}
      <div className="courses-grid">

        <div className="course-box">
          <img src="/images/course/course.png" className="course-icon" alt="" />
          <h3>Beginner Friendly</h3>
          <p>Perfect for first-time bakers.</p>
        </div>

        <div className="course-box">
          <img src="/images/course/course1.jpg" className="course-icon" alt="" />
          <h3>Hands-On Lessons</h3>
          <p>Learn cakes, pastries, cookies & more.</p>
        </div>

        <div className="course-box">
          <img src="/images/course/course2.jpg" className="course-icon" alt="" />
          <h3>Certificate</h3>
          <p>Recognized completion certificate.</p>
        </div>

        <div className="course-box">
          <img src="/images/course/course3.jpg" className="course-icon" alt="" />
          <h3>Lifetime Community</h3>
          <p>Join our group of passionate bakers.</p>
        </div>

      </div>

      {/* Button */}
      <button className="courses-btn">VIEW COURSES</button>

    </section>
  );
}
