class Volunteer < ActiveRecord::Base
	scope :active, -> { where("status in (0,1)") }
	scope :unapproved, -> { where("status = 0") }
	scope :approved, -> { where("status = 1") }
	scope :banned, -> { where("status = 2") }

	belongs_to :organization
	has_many :matches
	has_many :interactions, through: :matches
	has_many :documents, :foreign_key => "submitter_id"

	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable,
	    :recoverable, :rememberable, :trackable, :validatable

	has_attached_file :profile_image, styles: {
		thumb: '100x100>',
		square: '200x200#',
		medium: '300x300>'
	}

	validates :firstname, length: { in: 1..128 }
	validates :lastname, length: { in: 1..128 }
	validates :phone, format: { with: /\A\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\z/,
		message: "must be a valid phone number" }
	validates :address, length: { in: 5..255 }
	validates :languages, presence: true
	validates_attachment :profile_image,
		content_type: { content_type: /\Aimage\/.*\Z/ },
		size: { in: 0..2.megabytes }

	# Voter match functions
	def language_match voter
		(languages & voter.languages).present?
	end
	def voter_distance voter
		Geocoder::Calculations.distance_between [self.latitude, self.longitude], [voter.latitude, voter.longitude] rescue nil
	end
	def match_quality voter
		return 2 if city == voter.city && state = voter.state
		return 1 if state == voter.state
		return 0
	end
	def match_requests quality_threshold=0
		# Find language matches, exclude rejected and low-quality matches, and sort by quality
		matches = Voter.unmatched.select{ |v| self.language_match v }
		matches.reject!{ |m| self.matches.declined.map(&:voter_id).include? m.id }
		matches.reject!{ |m| self.match_quality(m) < quality_threshold }
		matches.sort{ |a, b| self.match_quality(b) <=> self.match_quality(a) }
	end

	# Accessor functions
	def total_duration
		self.interactions.map(&:duration).sum
	end

	# Helper functions
	def unapproved?
		status == 0
	end
	def approved?
		status == 1
	end
	def admin?
		admin
	end

end
