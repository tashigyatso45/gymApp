#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api

from models import Gym,Review,User

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'



class Gyms(Resource):
    def get(self):
        gyms = [gym.to_dict() for gym in Gym.query.all()]
        return make_response(gyms,200)
    def post(self):
        params = request.json
        try: 
            new_gym = Gym(
            name = params['name'],
            description=params['description'],
            rating= params['rating'],
            image= params['image'],
            # location = params['location']
            )
        except:
            return make_response({'error':' invalid gym'}, 400)
        db.session.add(new_gym)
        db.session.commit()
        return make_response(new_gym.to_dict(), 201)
             
        
api.add_resource(Gyms, '/gyms')



class Reviews(Resource):
    def get(self):
        reviews = [r.to_dict() for r in Review.query.all()]
        if not reviews :
            return make_response({'error':'no reviews'},400)
        return make_response(reviews,200)

    def post(self):
        params = request.json
        try: 
            new_review = Review(
            review_description = params['review_description'], name = params['name'],
            rating = params['rating'], gym_id =params['gym_id'],user_id = params['user_id']
            )
        except:
            return make_response({'error':' incorrect review'}, 400)
        db.session.add(new_review)
        db.session.commit()
        return make_response(new_review.to_dict(), 201)

api.add_resource(Reviews,'/reviews')

class Get_gym_by_id(Resource):
    def get(self, id):
        gym = Gym.query.get(id)
        if not gym:
            return make_response({'error':'gym not found'},400)
        else:
            return make_response(gym.to_dict(rules = ('-reviews.user',)), 200)

    def delete(self, id):
        gym = Gym.query.get(id)
        if not gym:
            return make_response({'error':'gym not found'},400)
        else:
            db.session.delete(gym)
            db.session.commit()
            return make_response('', 200)

    def patch(self, id):
        gym = Gym.query.get(id)
        if not gym:
            return make_response({'error':'not a gym'}, 400)
        params = request.json
        try:
            for attr in params:
                setattr(gym, attr, params[attr])
        except:
            return make_response( { 'error': [ 'user messed up' ] }, 422 )

        db.session.commit()
        return make_response(gym.to_dict(), 200)




api.add_resource(Get_gym_by_id, '/gyms/<int:id>')



    
if __name__ == '__main__':
    app.run(port=5555, debug=True)




        

with app.app_context():
    db.create_all()

