import { getAllTestimonials } from "@/lib/data/testimonials";
import { TestimonialCard } from "@/components/admin/TestimonialCard";

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Testimonios</h1>
      <p className="mt-1 text-sm text-mist">
        Administra las reseñas que aparecen en la sección de testimonios del sitio.
      </p>

      <div className="mt-8 space-y-4">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>

      <div className="mt-10 border-t border-line pt-8">
        <h2 className="text-sm font-medium text-mist">Agregar nuevo testimonio</h2>
        <div className="mt-4">
          <TestimonialCard key={`new-${testimonials.length}`} />
        </div>
      </div>
    </div>
  );
}
