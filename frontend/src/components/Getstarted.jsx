const Getstarted = () => {
  return (
    <div className=" flex items-center justify-center py-12 px-6 md:max-w-4xl mx-auto">
      <div className="w-full gap-3 bg-indigo-600 text-center py-16  rounded-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-4">
          Ready to Get Started?
        </h1>
        <p className="text-slate-300 text-xl text-center">
          Join hundreds of schools transoforming their adminisstration with
          EduSystems.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2  md:gap-0">
          <div className="flex items-center justify-center mt-6 md:px-16 px-12">
            <button className=" w-full bg-white text-indigo-600 font-bold py-4 rounded-xl hover:bg-gray-200 ">
              Start Free Trial
            </button>
          </div>
          <div className=" flex items-center justify-center px-12 mt-6 md:px-16">
            <button className=" w-full bg-transparent text-white font-bold py-4 rounded-xl border-2 border-white hover:bg-indigo-500">
              Contact Sales
            </button>
          </div>
        </div>
        <h4 className="text-slate-300 text-center text-sm mt-8">
          Free 14-day trial • No credit card required • Cancel anytime
        </h4>
      </div>
    </div>
  );
};
export default Getstarted;
