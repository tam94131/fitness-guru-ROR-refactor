class WeightsController < ApplicationController
  before_action :set_weight, only: [:show, :edit, :update, :destroy]

  # GET /weights
  # GET /weights.json
  def index
  	# puts "*** Hello there!! ***"
    @weights = Weight.all
  end

  # GET /weights/1
  # GET /weights/1.json
  def show
    @weights_count = Weight.count
    # @weights = Weight.where(userId: @profile.userId)
    @weights = Weight.where(userId: "abc123")
  end

  # GET /weights/new
  def new
    @id = params[:id]
    @weight = Weight.new
  end

  # GET /weights/1/edit
  def edit
  end

  # POST /weights
  # POST /weights.json
  def create
    @weight = Weight.new(weight_params)
    @rec = Profile.where(userId: @weight.userId)
    # puts "@@", @rec
    # puts @rec[0]
    # puts @rec[0].id 
    # puts "@@"

    respond_to do |format|
      if @weight.save
        format.html { redirect_to '/profiles/'+@rec[0].id.to_s, notice: 'weight was successfully created.' }
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
