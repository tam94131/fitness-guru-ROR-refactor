class WeightsController < ApplicationController
  before_action :set_profile, only: [:show, :edit, :update, :destroy]

  # GET /weights
  # GET /weights.json
  def index
  	puts "*** Hello there!! ***"
    @weights = Weight.all
  end

  # GET /weights/1
  # GET /weights/1.json
  def show
  end

  # GET /weights/new
  def new
    @weight = Weight.new
  end

  # GET /weights/1/edit
  def edit
  end

  # POST /weights
  # POST /weights.json
  def create
    @weight = Weight.new(weight_params)

    respond_to do |format|
      if @weight.save
        format.html { redirect_to @weight, notice: 'weight was successfully created.' }
        format.json { render :show, status: :created, location: @weight }
      else
        format.html { render :new }
        format.json { render json: @weight.errors, status: :unprocessable_entity }
      end
    end
  end


	private
    # Use callbacks to share common setup or constraints between actions.
    def set_weight
      @weight = Weight.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def weight_params
      params.require(:weight).permit(:weight, :userId)
    end

end
